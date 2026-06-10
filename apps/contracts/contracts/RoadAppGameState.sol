// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

interface IRoadAppNFTCards {
    function mintBossCard(address to, uint256 bossId) external;
    function mintRewardPack(address to, uint256 phase) external;
}

/**
 * @title RoadAppGameState
 * @notice Player state machine + anti-cheat for the Road App MiniPay game.
 *
 *  Design choices (aligned with Celopedia recommendations):
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
 *    from the previous lifecycle cannot be replayed in the new one.
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

    error AlreadyRegistered();
    error NotInThisPhase(uint256 expected, uint256 actual);
    error MustBackupSeedFirst();
    error SignatureExpired();
    error InvalidSignature();
    error TrustedSignerNotSet();
    error NotRegistered();
    error InvalidPhase(uint256 phase);
    error NotAContract(address target);

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

        emit PlayerRegistered(msg.sender);
        emit PhaseAdvanced(msg.sender, 1);
    }

    /**
     * @dev Admin-only "soft reset" for a player. Useful during workshops / demos where
     *      a tester wants to replay the journey. Does not burn cards.
     *      Bumps the player's nonce so pre-signed BossDefeat / SeedBackup receipts
     *      from before the reset cannot be replayed against the fresh lifecycle.
     */
    function restartPlayer(address player) external onlyOwner {
        if (players[player].currentPhase == 0) revert NotRegistered();
        delete players[player];
        players[player].currentPhase = 1;
        nonces[player] += 1; // invalidate every signature issued before this point
        emit PlayerRestarted(player, nonces[player]);
        emit PhaseAdvanced(player, 1);
    }

    // ---------------------------------------------------------------
    // Signature-gated state updates (EIP-712)
    // ---------------------------------------------------------------

    /**
     * @dev Mark the player's seed-phrase backup as verified. Requires a signature from
     *      the trustedSigner certifying the off-chain quiz/proof was completed.
     */
    function verifySeedPhraseBackup(uint256 deadline, bytes calldata signature) external {
        if (trustedSigner == address(0)) revert TrustedSignerNotSet();
        if (block.timestamp > deadline) revert SignatureExpired();
        PlayerState storage state = players[msg.sender];
        if (state.currentPhase < 2) revert NotInThisPhase(2, state.currentPhase);

        bytes32 structHash = keccak256(abi.encode(
            SEED_BACKUP_TYPEHASH,
            msg.sender,
            nonces[msg.sender]++,
            deadline
        ));
        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = digest.recover(signature);
        if (signer != trustedSigner) revert InvalidSignature();

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
