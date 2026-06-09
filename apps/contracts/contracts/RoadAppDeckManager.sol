// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IRoadAppNFTCards {
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract RoadAppDeckManager is Ownable {
    IRoadAppNFTCards public nftCardsContract;

    // Mapping from player to their active deck (array of NFT tokenIds)
    mapping(address => uint256[]) private activeDecks;

    event DeckSaved(address indexed player, uint256[] deckIds);

    constructor(address _nftCardsAddress) Ownable(msg.sender) {
        nftCardsContract = IRoadAppNFTCards(_nftCardsAddress);
    }

    function setNFTCardsContract(address _nftCardsAddress) external onlyOwner {
        nftCardsContract = IRoadAppNFTCards(_nftCardsAddress);
    }

    function saveDeck(uint256[] calldata deckIds) external {
        require(deckIds.length > 0 && deckIds.length <= 10, "Invalid deck size");

        // Validate ownership and ensure no duplicate token IDs are included in the deck
        for (uint i = 0; i < deckIds.length; i++) {
            // Nested loop to check for duplicates (fine for max 10 elements)
            for (uint j = i + 1; j < deckIds.length; j++) {
                require(deckIds[i] != deckIds[j], "Duplicate cards not allowed in deck");
            }
            address owner = nftCardsContract.ownerOf(deckIds[i]);
            require(owner == msg.sender, "You do not own all cards in this deck");
        }

        activeDecks[msg.sender] = deckIds;
        emit DeckSaved(msg.sender, deckIds);
    }

    function getActiveDeck(address player) external view returns (uint256[] memory) {
        return activeDecks[player];
    }

    function validateDeck(address player) external view returns (bool) {
        uint256[] memory deck = activeDecks[player];
        if (deck.length == 0) return false;

        for (uint i = 0; i < deck.length; i++) {
            try nftCardsContract.ownerOf(deck[i]) returns (address owner) {
                if (owner != player) {
                    return false;
                }
            } catch {
                return false;
            }
        }
        return true;
    }
}
