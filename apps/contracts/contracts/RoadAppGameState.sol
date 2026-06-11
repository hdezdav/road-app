// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

interface IRoadAppNFTCards {
    function mintBossCard(address to, uint256 bossId) external;
    function mintRewardPack(address to, uint256 phase) external;
    function mintStarterPack(address to) external;
    function ownerOf(uint256 tokenId) external view returns (address);
}

/**
 * @title RoadAppGameState
 * @notice Player state machine + anti-cheat + active deck storage for the Road
 *         App MiniPay game.
 *
 *  Design choices (aligned with Celopedia recommendations):
 *  - **Fusión DeckManager + GameState (v2)**: en v1 había tres contratos
 *    separados (NFTCards + GameState + DeckManager). Celopedia recomienda para
 *    MiniPay **separar activos del usuario de la lógica mutable**, pero no
 *    fragmentar la lógica en piezas cuando no aportan valor. DeckManager era
 *    el contrato más chico (~600K gas de despliegue), no almacenaba activos y
 *    su única dependencia hacia el NFT era una llamada de view `ownerOf`. Al
 *    fusionarlo aquí:
 *      • bajamos de 3 a 2 deploys (menos puntos de falla en mainnet),
 *      • eliminamos un wiring step (`setNFTCardsContract`),
 *      • `clearDeck()` se invoca automáticamente desde `restartPlayer` para
 *        que un soft-reset no deje al jugador con un deck stale,
 *      • el frontend ya no tiene que recordar tres direcciones distintas.
 *    NFTCards sigue siendo un contrato aparte porque es el activo del jugador:
 *    si encontramos un bug en la lógica de juego podemos redeployar este
 *    contrato sin migrar las cartas ya minteadas.
 *  - Anti-cheat uses EIP-712 typed data (BossDefeat / SeedBackup) instead of raw
 *    `keccak256(abi.encodePacked(...))`. The typed data domain includes name, version,
 *    chainId and verifyingContract, so a signature minted on Sepolia cannot be replayed
 *    on Mainnet. Per-player nonces + a deadline kill replay attacks.
 *  - `verifySeedPhraseBackup` is now also signature-gated (previously it was a free
 *    write that any client could call to flip the flag).
 *  - `setNFTContract` validates the target is actually a contract (avoids the case
 *    where the owner fat-fingers an EOA, breaking every boss defeat silently).
 *  - `recordBossDefeat` rejects phases outside [1..3] explicitly, instead of falling
 *    through the `else if` chain and silently wasting the player's nonce/signature.
 *  - `restartPlayer` bumps the player's nonce so any pre-signed boss-defeat receipts
 *    from the previous lifecycle cannot be replayed in the new one, AND limpia el
 *    deck activo para que el frontend no muestre uno stale después del reset.
 *  - Ownable2Step protects against a lost deployer key in MiniPay.
 *  - Events are emitted on every admin change for The Graph / Goldsky indexing.
 *  - `getRegisteredPlayers(offset, limit)` keeps the on-chain leaderboard cheap on
 *    the public Forno RPC (no log scanning required).
 */
contract RoadAppGameState is Ownable2Step, EIP712 {
    using ECDSA for bytes32;

    string private constant SIGNING_DOMAIN = "RoadAppGameState";
    string private constant SIGNATURE_VERSION = "1";

    // EIP-712 type hashes
    bytes32 private constant BOSS_DEFEAT_TYPEHASH = keccak256(
        "BossDefeat(address player,uint256 phase,uint256 nonce,uint256 deadline)"
    );
    bytes32 private constant SEED_BACKUP_TYPEHASH = keccak256(
        "SeedBackup(address player,uint256 nonce,uint256 deadline)"
    );

    uint256 public constant MAX_PHASE = 3;
    uint256 public constant COMPLETED_PHASE = 4;

    /// @dev UI shows 4-card decks for battles. We allow up to 10 for future modes.
    uint256 public constant MIN_DECK_SIZE = 2;
    uint256 public constant MAX_DECK_SIZE = 10;

    struct PlayerState {
        uint256 currentPhase;
        bool hasSeedPhraseBackedUp;
        bool hasDefeatedPhase1;
        bool hasDefeatedPhase2;
        bool hasDefeatedPhase3;
    }

    mapping(address => PlayerState) public players;
    mapping(address => uint256) public nonces;
    IRoadAppNFTCards public nftContract;
    address public trustedSigner;

    /// @dev Mazo activo del jugador (array de tokenIds). Antes vivía en
    /// `RoadAppDeckManager`; se fusionó para simplificar el despliegue.
    mapping(address => uint256[]) private activeDecks;

    /// @notice All addresses that ever called `registerPlayer`. Used by the on-chain
    /// leaderboard to enumerate participants without scanning logs (saves Forno RPC).
    /// Index 0 is intentionally left empty so `isRegistered` can use 0 as sentinel.
    address[] private registeredPlayers;
    mapping(address => uint256) private registeredIndex;

    event PhaseAdvanced(address indexed player, uint256 newPhase);
    event SeedPhraseBackedUp(address indexed player);
    event BossDefeated(address indexed player, uint256 phase);
    event PlayerRegistered(address indexed player);
    event PlayerRestarted(address indexed player, uint256 noncesBumpedTo);
    event SignerUpdated(address indexed newSigner);
    event NFTContractUpdated(address indexed newNFTContract);
    event DeckSaved(address indexed player, uint256[] deckIds);
    event DeckCleared(address indexed player);

    error AlreadyRegistered();
    error NotInThisPhase(uint256 expected, uint256 actual);
    error MustBackupSeedFirst();
    error SignatureExpired();
    error InvalidSignature();
    error TrustedSignerNotSet();
    error NotRegistered();
    error InvalidPhase(uint256 phase);
    error NotAContract(address target);
    error InvalidDeckSize(uint256 size);
    error DuplicateCard(uint256 tokenId);
    error NotOwnerOfCard(uint256 tokenId);
    error NFTContractNotSet();

    constructor() Ownable(msg.sender) EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {}

    // ---------------------------------------------------------------
    // Admin
    // ---------------------------------------------------------------

    function setNFTContract(address _nftContract) external onlyOwner {
        // Defensive: reject EOAs. If the owner mistakenly wires an EOA here, every
        // boss defeat would silently revert and burn the player's signed nonce.
        if (_nftContract.code.length == 0) revert NotAContract(_nftContract);
        nftContract = IRoadAppNFTCards(_nftContract);
        emit NFTContractUpdated(_nftContract);
    }

    function setTrustedSigner(address _signer) external onlyOwner {
        trustedSigner = _signer;
        emit SignerUpdated(_signer);
    }

    // ---------------------------------------------------------------
    // Player lifecycle
    // ---------------------------------------------------------------

    function registerPlayer() external {
        if (players[msg.sender].currentPhase != 0) revert AlreadyRegistered();
        players[msg.sender].currentPhase = 1;

        // Track for the on-chain leaderboard (no event scanning required).
        if (registeredIndex[msg.sender] == 0) {
            registeredPlayers.push(msg.sender);
            registeredIndex[msg.sender] = registeredPlayers.length; // 1-based
        }

        // Auto-mint starter pack in the same transaction!
        if (address(nftContract) != address(0)) {
            nftContract.mintStarterPack(msg.sender);
        }

        emit PlayerRegistered(msg.sender);
        emit PhaseAdvanced(msg.sender, 1);
    }

    /**
     * @dev Admin-only "soft reset" for a player. Useful during workshops / demos where
     *      a tester wants to replay the journey. Does not burn cards.
     *      Bumps the player's nonce so pre-signed BossDefeat / SeedBackup receipts
     *      from before the reset cannot be replayed against the fresh lifecycle.
     *      También limpia el deck activo: como las cartas son soulbound siguen en la
     *      wallet del jugador, pero el deck guardado pertenecía a la "vida" anterior y
     *      no tiene sentido conservarlo después del reset.
     */
    function restartPlayer(address player) external onlyOwner {
        if (players[player].currentPhase == 0) revert NotRegistered();
        delete players[player];
        players[player].currentPhase = 1;
        nonces[player] += 1; // invalidate every signature issued before this point

        if (activeDecks[player].length != 0) {
            delete activeDecks[player];
            emit DeckCleared(player);
        }

        emit PlayerRestarted(player, nonces[player]);
        emit PhaseAdvanced(player, 1);
    }

    // ---------------------------------------------------------------
    // Signature-gated state updates (EIP-712)
    // ---------------------------------------------------------------

    /**
     * @dev Mark the player's seed-phrase backup as verified.
     *
     *  Two modes, gated by `trustedSigner`:
     *  - OPEN mode (trustedSigner == 0): cualquier jugador en fase >= 2 puede
     *    marcar el respaldo. Esto desbloquea el flow educativo en mainnet sin
     *    necesidad de tener un backend signer corriendo (útil para demos y para
     *    el primer despliegue). Antes esto revertía con `TrustedSignerNotSet()`,
     *    rompiendo la Fase 2 completa: el jefe `Ransomware Interceptor` requiere
     *    `hasSeedPhraseBackedUp == true` y por lo tanto era imposible avanzar.
     *  - SIGNED mode (trustedSigner != 0): se exige una firma EIP-712 fresca y
     *    no expirada, con el nonce del jugador, certificando que el quiz
     *    off-chain fue completado. Esto es lo que se usa en producción "real".
     *
     *  En OPEN mode `deadline` y `signature` se ignoran (pero la ABI sigue
     *  exigiendo los 2 parámetros para que la codificación coincida en el cliente).
     */
    function verifySeedPhraseBackup(uint256 deadline, bytes calldata signature) external {
        PlayerState storage state = players[msg.sender];
        if (state.currentPhase < 2) revert NotInThisPhase(2, state.currentPhase);

        if (trustedSigner != address(0)) {
            if (block.timestamp > deadline) revert SignatureExpired();

            bytes32 structHash = keccak256(abi.encode(
                SEED_BACKUP_TYPEHASH,
                msg.sender,
                nonces[msg.sender]++,
                deadline
            ));
            bytes32 digest = _hashTypedDataV4(structHash);
            address signer = digest.recover(signature);
            if (signer != trustedSigner) revert InvalidSignature();
        }
        // En OPEN mode no consumimos `nonces[msg.sender]`: no hay riesgo de
        // replay (la operación es idempotente: una vez `true` queda `true`).

        state.hasSeedPhraseBackedUp = true;
        emit SeedPhraseBackedUp(msg.sender);
    }

    /**
     * @dev Record boss defeat with EIP-712 + nonce + deadline. Signature is required
     *      whenever a trustedSigner has been set (always in production).
     */
    function recordBossDefeat(uint256 phase, uint256 deadline, bytes calldata signature) external {
        // Reject phases outside [1..3] before touching nonce / state.
        if (phase == 0 || phase > MAX_PHASE) revert InvalidPhase(phase);

        PlayerState storage state = players[msg.sender];
        if (state.currentPhase != phase) revert NotInThisPhase(phase, state.currentPhase);

        // Pre-check de prerrequisitos ANTES de consumir nonce / verificar firma,
        // así un intento inválido no obliga al backend a re-firmar.
        if (phase == 2 && !state.hasSeedPhraseBackedUp) revert MustBackupSeedFirst();

        if (trustedSigner != address(0)) {
            if (block.timestamp > deadline) revert SignatureExpired();

            bytes32 structHash = keccak256(abi.encode(
                BOSS_DEFEAT_TYPEHASH,
                msg.sender,
                phase,
                nonces[msg.sender]++,
                deadline
            ));
            bytes32 digest = _hashTypedDataV4(structHash);
            address signer = digest.recover(signature);
            if (signer != trustedSigner) revert InvalidSignature();
        }

        if (phase == 1) {
            state.hasDefeatedPhase1 = true;
            state.currentPhase = 2;
            emit BossDefeated(msg.sender, 1);
            emit PhaseAdvanced(msg.sender, 2);

            if (address(nftContract) != address(0)) {
                nftContract.mintBossCard(msg.sender, 8); // BOSS_DUPLICATOR_HACKER
                nftContract.mintRewardPack(msg.sender, 1); // CARD_PHYSICAL_SEED
            }
        } else if (phase == 2) {
            // hasSeedPhraseBackedUp ya validado arriba
            state.hasDefeatedPhase2 = true;
            state.currentPhase = 3;
            emit BossDefeated(msg.sender, 2);
            emit PhaseAdvanced(msg.sender, 3);

            if (address(nftContract) != address(0)) {
                nftContract.mintBossCard(msg.sender, 9); // BOSS_RANSOMWARE_INTERCEPTOR
                nftContract.mintRewardPack(msg.sender, 2); // CARD_DIGITAL_SIGNATURE
            }
        } else {
            // phase == 3 (validated above to be in [1..3])
            state.hasDefeatedPhase3 = true;
            state.currentPhase = COMPLETED_PHASE; // 4 = completed
            emit BossDefeated(msg.sender, 3);
            emit PhaseAdvanced(msg.sender, COMPLETED_PHASE);

            if (address(nftContract) != address(0)) {
                nftContract.mintBossCard(msg.sender, 10); // BOSS_HIGH_GAS_MONSTER
                nftContract.mintRewardPack(msg.sender, 3); // CARD_CELO_SPEED
            }
        }
    }

    // ---------------------------------------------------------------
    // Deck management (fusionado desde RoadAppDeckManager v1)
    // ---------------------------------------------------------------

    /**
     * @notice Guarda el deck activo del jugador (entre MIN_DECK_SIZE y
     *         MAX_DECK_SIZE cartas). Verifica que el jugador sea dueño de cada
     *         tokenId y que no haya duplicados.
     *
     * @dev Requiere que `nftContract` haya sido configurado por el owner.
     *      Duplicate-detection es un doble bucle O(n²). Con MAX_DECK_SIZE = 10
     *      el coste en gas es despreciable y evita SSTORE adicionales. Si en
     *      el futuro se sube el tope conviene migrar a `tstore/tload` (Cancun)
     *      para bajar a O(n).
     *      Soulbound cards (enforced en RoadAppNFTCards) garantizan que
     *      `validateDeck` no se vuelva obsoleto por transferencias.
     */
    function saveDeck(uint256[] calldata deckIds) external {
        if (address(nftContract) == address(0)) revert NFTContractNotSet();

        uint256 len = deckIds.length;
        if (len < MIN_DECK_SIZE || len > MAX_DECK_SIZE) revert InvalidDeckSize(len);

        // O(n²) dup check: cheap up to MAX_DECK_SIZE=10 (~45 comparisons).
        for (uint256 i = 0; i < len; i++) {
            uint256 tokenId = deckIds[i];
            for (uint256 j = i + 1; j < len; j++) {
                if (deckIds[j] == tokenId) revert DuplicateCard(tokenId);
            }
            // try/catch turns "ERC721NonexistentToken" into a friendlier revert.
            try nftContract.ownerOf(tokenId) returns (address ownerAddr) {
                if (ownerAddr != msg.sender) revert NotOwnerOfCard(tokenId);
            } catch {
                revert NotOwnerOfCard(tokenId);
            }
        }

        activeDecks[msg.sender] = deckIds;
        emit DeckSaved(msg.sender, deckIds);
    }

    /// @notice Lets a player wipe their saved deck. Useful after a soft reset.
    function clearDeck() external {
        delete activeDecks[msg.sender];
        emit DeckCleared(msg.sender);
    }

    function getActiveDeck(address player) external view returns (uint256[] memory) {
        return activeDecks[player];
    }

    function validateDeck(address player) external view returns (bool) {
        uint256[] memory deck = activeDecks[player];
        if (deck.length == 0) return false;
        if (address(nftContract) == address(0)) return false;

        for (uint256 i = 0; i < deck.length; i++) {
            try nftContract.ownerOf(deck[i]) returns (address ownerAddr) {
                if (ownerAddr != player) {
                    return false;
                }
            } catch {
                return false;
            }
        }
        return true;
    }

    // ---------------------------------------------------------------
    // Views
    // ---------------------------------------------------------------

    function getPlayerState(address player) external view returns (PlayerState memory) {
        return players[player];
    }

    /// @notice Helper for off-chain signers to know the next nonce of a player.
    function getNonce(address player) external view returns (uint256) {
        return nonces[player];
    }

    /// @notice Cheap on-chain check used by the frontend to decide between
    /// "register" and "skip to phase" without spending a state read on every field.
    function isRegistered(address player) external view returns (bool) {
        return registeredIndex[player] != 0;
    }

    /// @notice Exposes the EIP-712 domain separator (handy for clients & The Graph).
    function domainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    // ---------------------------------------------------------------
    // Leaderboard helpers (avoid getLogs on public Forno RPC)
    // ---------------------------------------------------------------

    /// @notice Returns how many players have ever registered.
    function getRegisteredPlayersCount() external view returns (uint256) {
        return registeredPlayers.length;
    }

    /// @notice Returns a window of registered players for paginated leaderboards.
    /// @param offset Index of the first player to return (0-based).
    /// @param limit Maximum number of players to return.
    function getRegisteredPlayers(uint256 offset, uint256 limit)
        external
        view
        returns (address[] memory page)
    {
        uint256 total = registeredPlayers.length;
        if (offset >= total) return new address[](0);
        uint256 end = offset + limit;
        if (end > total) end = total;
        page = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            page[i - offset] = registeredPlayers[i];
        }
    }
}
