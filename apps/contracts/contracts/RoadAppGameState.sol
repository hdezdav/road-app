// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

interface IRoadAppNFTCards {
    function mintBossCard(address to, uint256 bossId) external;
    function mintRewardPack(address to, uint256 phase) external;
}

contract RoadAppGameState is Ownable {
    using ECDSA for bytes32;
    
    struct PlayerState {
        uint256 currentPhase;
        bool hasSeedPhraseBackedUp;
        bool hasDefeatedPhase1;
        bool hasDefeatedPhase2;
        bool hasDefeatedPhase3;
    }

    mapping(address => PlayerState) public players;
    IRoadAppNFTCards public nftContract;
    address public trustedSigner;

    event PhaseAdvanced(address indexed player, uint256 newPhase);
    event SeedPhraseBackedUp(address indexed player);
    event BossDefeated(address indexed player, uint256 phase);
    event SignerUpdated(address newSigner);

    constructor() Ownable(msg.sender) {}

    function setNFTContract(address _nftContract) external onlyOwner {
        nftContract = IRoadAppNFTCards(_nftContract);
    }

    function setTrustedSigner(address _signer) external onlyOwner {
        trustedSigner = _signer;
        emit SignerUpdated(_signer);
    }

    function registerPlayer() external {
        require(players[msg.sender].currentPhase == 0, "Player already registered");
        players[msg.sender].currentPhase = 1;
        emit PhaseAdvanced(msg.sender, 1);
    }

    function verifySeedPhraseBackup() external {
        require(players[msg.sender].currentPhase >= 2, "Must be at least in phase 2");
        players[msg.sender].hasSeedPhraseBackedUp = true;
        emit SeedPhraseBackedUp(msg.sender);
    }

    /**
     * @dev Record boss defeat. If trustedSigner is set, a signature is verified to prevent cheating.
     */
    function recordBossDefeat(uint256 phase, bytes calldata signature) external {
        PlayerState storage state = players[msg.sender];
        require(state.currentPhase == phase, "Player is not in this phase");

        // Verify signature if a trusted signer has been set
        if (trustedSigner != address(0)) {
            bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, phase));
            bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
            address signer = ethSignedMessageHash.recover(signature);
            require(signer == trustedSigner, "Invalid signature: anti-cheat check failed");
        }

        if (phase == 1) {
            state.hasDefeatedPhase1 = true;
            state.currentPhase = 2;
            emit BossDefeated(msg.sender, 1);
            emit PhaseAdvanced(msg.sender, 2);
            
            // Mint Boss 1 & Phase 1 Reward Pack (which has physical seed card)
            if (address(nftContract) != address(0)) {
                nftContract.mintBossCard(msg.sender, 8); // BOSS_DUPLICATOR_HACKER
                nftContract.mintRewardPack(msg.sender, 1); // CARD_PHYSICAL_SEED
            }
        } else if (phase == 2) {
            require(state.hasSeedPhraseBackedUp, "Must backup seed phrase to defeat boss");
            state.hasDefeatedPhase2 = true;
            state.currentPhase = 3;
            emit BossDefeated(msg.sender, 2);
            emit PhaseAdvanced(msg.sender, 3);

            // Mint Boss 2 & Phase 2 Reward Pack (which has digital signature card)
            if (address(nftContract) != address(0)) {
                nftContract.mintBossCard(msg.sender, 9); // BOSS_RANSOMWARE_INTERCEPTOR
                nftContract.mintRewardPack(msg.sender, 2); // CARD_DIGITAL_SIGNATURE
            }
        } else if (phase == 3) {
            state.hasDefeatedPhase3 = true;
            // Advance to Phase 4 (Completion)
            state.currentPhase = 4;
            emit BossDefeated(msg.sender, 3);
            emit PhaseAdvanced(msg.sender, 4);
            
            // Mint Boss 3 & Phase 3 Reward Pack (which has parallel Celo card)
            if (address(nftContract) != address(0)) {
                nftContract.mintBossCard(msg.sender, 10); // BOSS_HIGH_GAS_MONSTER
                nftContract.mintRewardPack(msg.sender, 3); // CARD_CELO_SPEED
            }
        }
    }

    function getPlayerState(address player) external view returns (PlayerState memory) {
        return players[player];
    }
}
