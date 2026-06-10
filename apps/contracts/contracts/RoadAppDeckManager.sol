// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable2Step.sol";

interface IRoadAppNFTCards {
    function ownerOf(uint256 tokenId) external view returns (address);
}

/**
 * @title RoadAppDeckManager
 * @notice Stores each player's active battle deck (between MIN_DECK_SIZE and
 *         MAX_DECK_SIZE NFT cards).
 *
 *  Design choices (aligned with Celopedia recommendations):
 *  - Ownable2Step (safer admin handover, no single-step transfer to a typo).
 *  - Sanity-checks the NFT contract address: only contracts allowed, otherwise the
 *    very first `saveDeck` reverts with a confusing inner error.
 *  - `MIN_DECK_SIZE` enforces that the player commits a real battle deck (the UI
 *    only renders 4-card decks; allowing 1-card decks would break the battle screen).
 *  - Duplicate-detection es un doble bucle O(n²). Con MAX_DECK_SIZE = 10 el coste
 *    en gas es despreciable y evita SSTORE adicionales. Si en el futuro se sube
 *    el tope conviene migrar a `tstore/tload` (Cancun) para bajar a O(n).
 *  - Soulbound cards (enforced in RoadAppNFTCards) guarantee `validateDeck` cannot
 *    become outdated by transfers — the deck only invalidates if the player resets.
 *  - `clearDeck` lets a player explicitly drop their saved deck (e.g. after the
 *    admin calls `RoadAppGameState.restartPlayer`).
 */
contract RoadAppDeckManager is Ownable2Step {
    /// @dev UI shows 4-card decks for battles. We allow up to 10 for future modes.
    uint256 public constant MIN_DECK_SIZE = 2;
    uint256 public constant MAX_DECK_SIZE = 10;

    IRoadAppNFTCards public nftCardsContract;

    // Mapping from player to their active deck (array of NFT tokenIds)
    mapping(address => uint256[]) private activeDecks;

    event DeckSaved(address indexed player, uint256[] deckIds);
    event DeckCleared(address indexed player);
    event NFTCardsContractUpdated(address indexed newAddress);

    error InvalidDeckSize(uint256 size);
    error DuplicateCard(uint256 tokenId);
    error NotOwnerOfCard(uint256 tokenId);
    error NotAContract(address target);

    constructor(address _nftCardsAddress) Ownable(msg.sender) {
        if (_nftCardsAddress.code.length == 0) revert NotAContract(_nftCardsAddress);
        nftCardsContract = IRoadAppNFTCards(_nftCardsAddress);
        emit NFTCardsContractUpdated(_nftCardsAddress);
    }

    function setNFTCardsContract(address _nftCardsAddress) external onlyOwner {
        if (_nftCardsAddress.code.length == 0) revert NotAContract(_nftCardsAddress);
        nftCardsContract = IRoadAppNFTCards(_nftCardsAddress);
        emit NFTCardsContractUpdated(_nftCardsAddress);
    }

    function saveDeck(uint256[] calldata deckIds) external {
        uint256 len = deckIds.length;
        if (len < MIN_DECK_SIZE || len > MAX_DECK_SIZE) revert InvalidDeckSize(len);

        // O(n²) dup check: cheap up to MAX_DECK_SIZE=10 (~45 comparisons).
        for (uint256 i = 0; i < len; i++) {
            uint256 tokenId = deckIds[i];
            for (uint256 j = i + 1; j < len; j++) {
                if (deckIds[j] == tokenId) revert DuplicateCard(tokenId);
            }
            // try/catch turns "ERC721NonexistentToken" into a friendlier revert.
            try nftCardsContract.ownerOf(tokenId) returns (address ownerAddr) {
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

        for (uint256 i = 0; i < deck.length; i++) {
            try nftCardsContract.ownerOf(deck[i]) returns (address ownerAddr) {
                if (ownerAddr != player) {
                    return false;
                }
            } catch {
                return false;
            }
        }
        return true;
    }
}
