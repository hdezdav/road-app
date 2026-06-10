// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title RoadAppNFTCards
 * @notice ERC-721 collection of 10 educational cards for the Road App MiniPay game.
 *
 *  Design choices (aligned with Celopedia recommendations):
 *  - Inherits ERC721Enumerable so `getOwnedCards` runs in O(balance) instead of O(totalSupply).
 *    Critical for MiniPay UX where the public Forno RPC has tight `eth_call` limits.
 *  - Soulbound: cards are non-transferable between EOAs. They can only be minted (from = 0x0)
 *    and burned (to = 0x0). This keeps `DeckManager.validateDeck` consistent: a saved deck cannot
 *    silently become invalid because the player sold the cards.
 *  - Ownable2Step: protects against accidentally transferring ownership to an unreachable address.
 *  - **Metadata 100% on-chain (data URI + base64)**: `tokenURI(tokenId)` returns a fully formed
 *    JSON inline. This means MetaMask, MiniPay, OpenSea and Celoscan can render the card name,
 *    description, image and attributes without depending on any IPFS gateway. `baseMetadataURI`
 *    is still used as the prefix for the `image` field, so the user can later swap to their own
 *    art on IPFS / Arweave / R2 by calling `setBaseMetadataURI(...)`. Until then we fall back to
 *    a stable hosted SVG placeholder so wallets always see *something*.
 *  - Learning-path NOT random: each tokenId belongs to a fixed `cardCatalogId` (1..10) tied to a
 *    concept of the educational route (anti-phishing, seed phrase, L2, etc.). We never roll dice
 *    on rarity or type, unlike open card games. This keeps the experience deterministic and
 *    pedagogical.
 */
contract RoadAppNFTCards is ERC721Enumerable, Ownable2Step {
    using Strings for uint256;

    uint256 private _nextTokenId;

    /// @dev Prefix used to build the `image` field of each token's metadata, e.g.
    ///      `ipfs://bafy.../` + cardCatalogId + ".png". Mutable via owner so we can ship a
    ///      placeholder at launch and upgrade to final art later without redeploying.
    string public baseMetadataURI;

    struct CardData {
        uint256 cardCatalogId; // 1..10, corresponds to the learning-path catalog
        uint256 attack;
        uint256 defense;
    }

    struct OwnedCardInfo {
        uint256 tokenId;
        uint256 cardCatalogId;
        uint256 attack;
        uint256 defense;
    }

    mapping(uint256 => CardData) public cards;
    mapping(address => bool) public authorizedMinters;
    mapping(address => bool) public hasClaimedStarter;

    /// @notice Tracks whether a player already received the reward pack for a given
    /// road / phase (phase = 1, 2, 3). Defensa en profundidad: el flujo principal en
    /// `RoadAppGameState.recordBossDefeat` ya impide reclamar dos veces porque
    /// `currentPhase != phase` en el segundo intento, pero exponemos también esta
    /// invariante a nivel del contrato de NFTs para que un futuro `setMinter` con un
    /// nuevo orquestador no pueda mintear sobres duplicados por error.
    mapping(address => mapping(uint256 => bool)) public hasClaimedRewardPack;
    /// @notice Tracks whether a player already received the boss-defeat NFT for a
    /// given bossId (8 = duplicator, 9 = ransomware, 10 = high-gas). Misma idea.
    mapping(address => mapping(uint256 => bool)) public hasClaimedBoss;


    event CardMinted(
        address indexed owner,
        uint256 indexed tokenId,
        uint256 indexed cardCatalogId,
        uint256 attack,
        uint256 defense
    );
    event MinterStatusChanged(address indexed minter, bool status);
    event StarterClaimed(address indexed player);
    event BaseURIChanged(string newBaseURI);

    error NotAuthorizedMinter();
    error StarterAlreadyClaimed();
    error InvalidBossId(uint256 bossId);
    error InvalidPhase(uint256 phase);
    error CardsAreSoulbound();
    error UnknownCard(uint256 cardCatalogId);
    error RewardPackAlreadyClaimed(address player, uint256 phase);
    error BossAlreadyClaimed(address player, uint256 bossId);

    modifier onlyMinter() {
        if (!authorizedMinters[msg.sender] && msg.sender != owner()) revert NotAuthorizedMinter();
        _;
    }

    constructor(string memory _baseMetadataURI)
        ERC721("RoadApp Card", "ROAD")
        Ownable(msg.sender)
    {
        _nextTokenId = 1;
        baseMetadataURI = _baseMetadataURI;
    }

    // ---------------------------------------------------------------
    // Admin
    // ---------------------------------------------------------------

    function setMinter(address minter, bool status) external onlyOwner {
        authorizedMinters[minter] = status;
        emit MinterStatusChanged(minter, status);
    }

    function setBaseMetadataURI(string calldata _newBaseURI) external onlyOwner {
        baseMetadataURI = _newBaseURI;
        emit BaseURIChanged(_newBaseURI);
    }

    // ---------------------------------------------------------------
    // Minting
    // ---------------------------------------------------------------

    function _mintCardInternal(address to, uint256 cardCatalogId, uint256 attack, uint256 defense) internal returns (uint256) {
        uint256 tokenId = _nextTokenId++;

        cards[tokenId] = CardData({
            cardCatalogId: cardCatalogId,
            attack: attack,
            defense: defense
        });

        _safeMint(to, tokenId);

        emit CardMinted(to, tokenId, cardCatalogId, attack, defense);
        return tokenId;
    }

    function mintCard(address to, uint256 cardCatalogId, uint256 attack, uint256 defense) external onlyMinter returns (uint256) {
        return _mintCardInternal(to, cardCatalogId, attack, defense);
    }

    function mintStarterPack(address to) external {
        require(to == msg.sender, "Can only claim your own starter");
        if (hasClaimedStarter[to]) revert StarterAlreadyClaimed();
        hasClaimedStarter[to] = true;

        // Fixed learning-path starter (NOT random):
        _mintCardInternal(to, 1, 30, 50); // Filtro Anti-Phishing
        _mintCardInternal(to, 3, 20, 20); // Canal de Capa 2
        _mintCardInternal(to, 4, 45, 30); // Smart Contract Blindado
        _mintCardInternal(to, 6, 15, 60); // Libro Contable Inmutable

        emit StarterClaimed(to);
    }

    /**
     * @dev Mints the reward pack tied to a completed road / phase. Idempotente:
     *      si el jugador ya reclamó el sobre de esa fase la llamada revierte con
     *      `RewardPackAlreadyClaimed(player, phase)`. Esto garantiza el invariante
     *      "Cada sobre solamente puede reclamarse una vez" pedido en la spec.
     */
    function mintRewardPack(address to, uint256 phase) external onlyMinter {
        if (phase < 1 || phase > 3) revert InvalidPhase(phase);
        if (hasClaimedRewardPack[to][phase]) revert RewardPackAlreadyClaimed(to, phase);
        hasClaimedRewardPack[to][phase] = true;

        if (phase == 1) {
            _mintCardInternal(to, 2, 0, 90);   // Frase Semilla Física
        } else if (phase == 2) {
            _mintCardInternal(to, 5, 60, 10);  // Firma Digital
        } else {
            // phase == 3 (validated above)
            _mintCardInternal(to, 7, 70, 40);  // Velocidad de Celo / Plumo
        }
    }

    /**
     * @dev Mints the boss-defeat trophy card. Idempotente: si el jugador ya tiene
     *      ese boss revierte con `BossAlreadyClaimed(player, bossId)`. Combinado
     *      con `RoadAppGameState.recordBossDefeat`, esto impide que un orquestador
     *      mal configurado mintee dos veces el mismo trofeo al mismo jugador.
     */
    function mintBossCard(address to, uint256 bossId) external onlyMinter {
        if (bossId < 8 || bossId > 10) revert InvalidBossId(bossId);
        if (hasClaimedBoss[to][bossId]) revert BossAlreadyClaimed(to, bossId);
        hasClaimedBoss[to][bossId] = true;

        if (bossId == 8) {
            _mintCardInternal(to, 8, 40, 100);  // Hacker Duplicador
        } else if (bossId == 9) {
            _mintCardInternal(to, 9, 60, 150);  // Ransomware Interceptor
        } else {
            // bossId == 10 (validated above)
            _mintCardInternal(to, 10, 80, 200); // Monstruo del Gas Alto
        }
    }

    // ---------------------------------------------------------------
    // Views (mobile/MiniPay friendly)
    // ---------------------------------------------------------------

    function getOwnedCards(address player) external view returns (OwnedCardInfo[] memory) {
        uint256 balance = balanceOf(player);
        OwnedCardInfo[] memory owned = new OwnedCardInfo[](balance);

        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(player, i);
            CardData storage data = cards[tokenId];
            owned[i] = OwnedCardInfo({
                tokenId: tokenId,
                cardCatalogId: data.cardCatalogId,
                attack: data.attack,
                defense: data.defense
            });
        }
        return owned;
    }

    function totalSupply() public view override(ERC721Enumerable) returns (uint256) {
        return super.totalSupply();
    }

    // ---------------------------------------------------------------
    // On-chain metadata (OpenSea / MetaMask / MiniPay compatible)
    // ---------------------------------------------------------------

    /**
     * @dev Returns a `data:application/json;base64,...` URI containing the full metadata for
     *      the given tokenId. The JSON follows the OpenSea/ERC-721 metadata schema so any
     *      wallet that supports NFTs will render the card properly out of the box.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        CardData storage data = cards[tokenId];

        (string memory name, string memory description, string memory category) =
            _catalogInfo(data.cardCatalogId);

        string memory image = _imageURI(data.cardCatalogId);

        bytes memory json = abi.encodePacked(
            '{"name":"', name, ' #', tokenId.toString(),
            '","description":"', description,
            '","image":"', image,
            '","attributes":[',
                '{"trait_type":"Catalog ID","value":', data.cardCatalogId.toString(), '},',
                '{"trait_type":"Category","value":"', category, '"},',
                '{"trait_type":"Attack","value":', data.attack.toString(), '},',
                '{"trait_type":"Defense","value":', data.defense.toString(), '}',
            ']}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(json)
            )
        );
    }

    /// @dev Image URL builder. Uses `baseMetadataURI` if set, else falls back to a hosted
    ///      SVG placeholder so the wallet always renders something during early testnet.
    function _imageURI(uint256 cardCatalogId) internal view returns (string memory) {
        if (bytes(baseMetadataURI).length == 0) {
            // Stable public placeholder (data URI SVG so no network needed).
            return _placeholderSvg(cardCatalogId);
        }
        return string(abi.encodePacked(baseMetadataURI, cardCatalogId.toString(), ".png"));
    }

    function _placeholderSvg(uint256 cardCatalogId) internal pure returns (string memory) {
        bytes memory svg = abi.encodePacked(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 350 500'>",
            "<rect width='100%' height='100%' fill='#FCFF52'/>",
            "<text x='50%' y='40%' font-family='monospace' font-size='28' fill='#000' text-anchor='middle'>RoadApp</text>",
            "<text x='50%' y='55%' font-family='monospace' font-size='64' fill='#000' text-anchor='middle'>#",
            cardCatalogId.toString(),
            "</text></svg>"
        );
        return string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(svg)
            )
        );
    }

    /// @dev Hard-coded catalog of the 10 educational cards. Not random: this is the canonical
    ///      learning path of the MiniPay game (anti-phishing -> seed -> L2 -> contracts -> ...).
    function _catalogInfo(uint256 cardCatalogId)
        internal
        pure
        returns (string memory name, string memory description, string memory category)
    {
        if (cardCatalogId == 1) {
            return (
                "Filtro Anti-Phishing",
                "Bloquea intentos de phishing dirigidos a tu wallet de Celo.",
                "Seguridad"
            );
        } else if (cardCatalogId == 2) {
            return (
                "Frase Semilla Fisica",
                "Respalda tu seed phrase fuera de linea. Recompensa de la Fase 1.",
                "Custodia"
            );
        } else if (cardCatalogId == 3) {
            return (
                "Canal de Capa 2",
                "Capa 2 sobre Celo para escalar pagos con MiniPay.",
                "Infraestructura"
            );
        } else if (cardCatalogId == 4) {
            return (
                "Smart Contract Blindado",
                "Contrato auditado y resistente a reentrancy.",
                "Smart Contracts"
            );
        } else if (cardCatalogId == 5) {
            return (
                "Firma Digital",
                "Firma EIP-712 que autentica jugadas off-chain. Recompensa de la Fase 2.",
                "Criptografia"
            );
        } else if (cardCatalogId == 6) {
            return (
                "Libro Contable Inmutable",
                "El ledger publico de Celo, fuente unica de verdad.",
                "Blockchain"
            );
        } else if (cardCatalogId == 7) {
            return (
                "Transaccion Veloz Celo",
                "Bloques rapidos de Celo (Plumo). Recompensa de la Fase 3.",
                "Performance"
            );
        } else if (cardCatalogId == 8) {
            return (
                "Hacker Duplicador",
                "Boss 1 capturado: ataque de replay neutralizado.",
                "Boss"
            );
        } else if (cardCatalogId == 9) {
            return (
                "Ransomware Interceptor",
                "Boss 2 capturado: defensa contra secuestro de claves.",
                "Boss"
            );
        } else if (cardCatalogId == 10) {
            return (
                "Monstruo del Gas Alto",
                "Boss 3 capturado: dominio absoluto del fee market de Celo.",
                "Boss"
            );
        }
        revert UnknownCard(cardCatalogId);
    }

    // ---------------------------------------------------------------
    // Soulbound enforcement + multiple inheritance plumbing (OZ v5)
    // ---------------------------------------------------------------

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721Enumerable)
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert CardsAreSoulbound();
        }
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
