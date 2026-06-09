// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RoadAppNFTCards is ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    string public baseMetadataURI;

    struct CardData {
        uint256 cardCatalogId; // 1 to 10 corresponding to cardsCatalog
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

    event CardMinted(address indexed owner, uint256 indexed tokenId, uint256 cardCatalogId);
    event MinterStatusChanged(address minter, bool status);
    event StarterClaimed(address player);
    event BaseURIChanged(string newBaseURI);

    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }

    constructor(string memory _baseMetadataURI) ERC721("RoadApp Card", "ROAD") Ownable(msg.sender) {
        _nextTokenId = 1; // Start tokenIds at 1
        baseMetadataURI = _baseMetadataURI;
    }

    function setMinter(address minter, bool status) external onlyOwner {
        authorizedMinters[minter] = status;
        emit MinterStatusChanged(minter, status);
    }

    function setBaseMetadataURI(string calldata _newBaseURI) external onlyOwner {
        baseMetadataURI = _newBaseURI;
        emit BaseURIChanged(_newBaseURI);
    }

    /**
     * @dev Internal minting function that bypasses onlyMinter check for internal contract actions.
     */
    function _mintCardInternal(address to, uint256 cardCatalogId, uint256 attack, uint256 defense) internal returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        cards[tokenId] = CardData({
            cardCatalogId: cardCatalogId,
            attack: attack,
            defense: defense
        });

        _safeMint(to, tokenId);
        
        // Construct token URI dynamically based on baseMetadataURI and cardCatalogId
        string memory tokenURIString = string(abi.encodePacked(baseMetadataURI, cardCatalogId.toString(), ".json"));
        _setTokenURI(tokenId, tokenURIString);

        emit CardMinted(to, tokenId, cardCatalogId);
        return tokenId;
    }

    /**
     * @dev Mints a new Card NFT. Only callable by owner or authorized minters.
     */
    function mintCard(address to, uint256 cardCatalogId, uint256 attack, uint256 defense) external onlyMinter returns (uint256) {
        return _mintCardInternal(to, cardCatalogId, attack, defense);
    }

    /**
     * @dev Mint starter pack cards in order. Anyone can claim their starter pack once.
     */
    function mintStarterPack(address to) external {
        require(!hasClaimedStarter[to], "Starter pack already claimed");
        hasClaimedStarter[to] = true;

        // Mint starter cards:
        // 1. Filtro Anti-Phishing (cardCatalogId 1, attack 30, defense 50)
        _mintCardInternal(to, 1, 30, 50);
        // 2. Canal de Capa 2 (cardCatalogId 3, attack 20, defense 20)
        _mintCardInternal(to, 3, 20, 20);
        // 3. Smart Contract Blindado (cardCatalogId 4, attack 45, defense 30)
        _mintCardInternal(to, 4, 45, 30);
        // 4. Libro Contable Inmutable (cardCatalogId 6, attack 15, defense 60)
        _mintCardInternal(to, 6, 15, 60);

        emit StarterClaimed(to);
    }

    /**
     * @dev Mint learning path rewards upon phase completion. Only callable by minters.
     */
    function mintRewardPack(address to, uint256 phase) external onlyMinter {
        if (phase == 1) {
            // Frase Semilla Física (cardCatalogId 2, attack 0, defense 90)
            _mintCardInternal(to, 2, 0, 90);
        } else if (phase == 2) {
            // Firma Digital (cardCatalogId 5, attack 60, defense 10)
            _mintCardInternal(to, 5, 60, 10);
        } else if (phase == 3) {
            // Velocidad de Celo / Plumo (cardCatalogId 7, attack 70, defense 40)
            _mintCardInternal(to, 7, 70, 40);
        }
    }

    /**
     * @dev Mint boss NFT cards upon victory. Only callable by minters.
     */
    function mintBossCard(address to, uint256 bossId) external onlyMinter {
        if (bossId == 8) {
            // Boss 1: Hacker Duplicador (bossId 8, attack 40, defense 100)
            _mintCardInternal(to, 8, 40, 100);
        } else if (bossId == 9) {
            // Boss 2: Ransomware Interceptor (bossId 9, attack 60, defense 150)
            _mintCardInternal(to, 9, 60, 150);
        } else if (bossId == 10) {
            // Boss 3: Monstruo del Gas Alto (bossId 10, attack 80, defense 200)
            _mintCardInternal(to, 10, 80, 200);
        }
    }

    /**
     * @dev Returns all card NFTs owned by a player in a single RPC call.
     */
    function getOwnedCards(address player) external view returns (OwnedCardInfo[] memory) {
        uint256 total = totalSupply();
        uint256 count = 0;
        
        for (uint256 i = 1; i <= total; i++) {
            if (ownerOf(i) == player) {
                count++;
            }
        }
        
        OwnedCardInfo[] memory owned = new OwnedCardInfo[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= total; i++) {
            if (ownerOf(i) == player) {
                CardData storage data = cards[i];
                owned[index] = OwnedCardInfo({
                    tokenId: i,
                    cardCatalogId: data.cardCatalogId,
                    attack: data.attack,
                    defense: data.defense
                });
                index++;
            }
        }
        return owned;
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }
}
