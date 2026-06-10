import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseSignature } from "viem";

/**
 * Smoke tests for the three Road App contracts.
 * Run with: `pnpm --filter hardhat test`
 */
describe("Road App contracts", function () {
  async function deployFixture() {
    const [owner, alice, bob, signer] = await hre.viem.getWalletClients();
    const publicClient = await hre.viem.getPublicClient();

    const baseURI = "ipfs://test/";
    const nft = await hre.viem.deployContract("RoadAppNFTCards", [baseURI]);
    const deck = await hre.viem.deployContract("RoadAppDeckManager", [nft.address]);
    const game = await hre.viem.deployContract("RoadAppGameState", []);

    // Wire
    await game.write.setNFTContract([nft.address]);
    await nft.write.setMinter([game.address, true]);

    return { owner, alice, bob, signer, publicClient, nft, deck, game, baseURI };
  }

  // ---------------- Starter pack ----------------

  describe("NFTCards - starter pack", () => {
    it("mints 4 cards on first claim", async () => {
      const { nft, alice } = await deployFixture();
      const aliceNft = await hre.viem.getContractAt("RoadAppNFTCards", nft.address, { client: { wallet: alice } });

      await aliceNft.write.mintStarterPack([alice.account.address]);
      const balance = await nft.read.balanceOf([alice.account.address]);
      expect(balance).to.equal(4n);
    });

    it("reverts on double claim", async () => {
      const { nft, alice } = await deployFixture();
      const aliceNft = await hre.viem.getContractAt("RoadAppNFTCards", nft.address, { client: { wallet: alice } });

      await aliceNft.write.mintStarterPack([alice.account.address]);
      await expect(aliceNft.write.mintStarterPack([alice.account.address])).to.be.rejected;
    });

    it("reverts when claiming on behalf of someone else", async () => {
      const { nft, alice, bob } = await deployFixture();
      const aliceNft = await hre.viem.getContractAt("RoadAppNFTCards", nft.address, { client: { wallet: alice } });
      await expect(aliceNft.write.mintStarterPack([bob.account.address])).to.be.rejected;
    });
  });

  // ---------------- On-chain metadata ----------------

  describe("NFTCards - on-chain metadata", () => {
    it("tokenURI returns a base64 data URI with valid JSON", async () => {
      const { nft, alice } = await deployFixture();
      const aliceNft = await hre.viem.getContractAt("RoadAppNFTCards", nft.address, { client: { wallet: alice } });
      await aliceNft.write.mintStarterPack([alice.account.address]);

      const uri = (await nft.read.tokenURI([1n])) as string;
      expect(uri.startsWith("data:application/json;base64,")).to.equal(true);

      const base64 = uri.replace("data:application/json;base64,", "");
      const json = JSON.parse(Buffer.from(base64, "base64").toString("utf8"));

      expect(json.name).to.contain("Filtro Anti-Phishing");
      expect(json.description).to.be.a("string");
      expect(json.image).to.be.a("string");
      expect(json.attributes).to.be.an("array");
      const attack = json.attributes.find((a: any) => a.trait_type === "Attack");
      expect(Number(attack.value)).to.equal(30);
    });

    it("reverts tokenURI for nonexistent tokens", async () => {
      const { nft } = await deployFixture();
      await expect(nft.read.tokenURI([999n])).to.be.rejected;
    });

    it("setBaseMetadataURI swaps the image prefix", async () => {
      const { nft, owner, alice } = await deployFixture();
      const aliceNft = await hre.viem.getContractAt("RoadAppNFTCards", nft.address, { client: { wallet: alice } });
      await aliceNft.write.mintStarterPack([alice.account.address]);

      await nft.write.setBaseMetadataURI(["ipfs://newcid/"]);
      const uri = (await nft.read.tokenURI([1n])) as string;
      const base64 = uri.replace("data:application/json;base64,", "");
      const json = JSON.parse(Buffer.from(base64, "base64").toString("utf8"));
      expect(json.image).to.equal("ipfs://newcid/1.png");
    });
  });

  // ---------------- Soulbound ----------------

  describe("NFTCards - soulbound", () => {
    it("blocks peer-to-peer transfer", async () => {
      const { nft, alice, bob } = await deployFixture();
      const aliceNft = await hre.viem.getContractAt("RoadAppNFTCards", nft.address, { client: { wallet: alice } });

      await aliceNft.write.mintStarterPack([alice.account.address]);
      await expect(
        aliceNft.write.transferFrom([alice.account.address, bob.account.address, 1n])
      ).to.be.rejected;
    });
  });

  // ---------------- mintBossCard validation ----------------

  describe("NFTCards - mintBossCard", () => {
    it("reverts on invalid bossId", async () => {
      const { nft, owner, alice } = await deployFixture();
      await expect(nft.write.mintBossCard([alice.account.address, 99n])).to.be.rejected;
    });

    it("mints boss card 8/9/10 OK", async () => {
      const { nft, alice } = await deployFixture();
      await nft.write.mintBossCard([alice.account.address, 8n]);
      await nft.write.mintBossCard([alice.account.address, 9n]);
      await nft.write.mintBossCard([alice.account.address, 10n]);
      expect(await nft.read.balanceOf([alice.account.address])).to.equal(3n);
    });
  });

  // ---------------- GameState lifecycle ----------------

  describe("GameState lifecycle", () => {
    it("registers player into phase 1", async () => {
      const { game, alice } = await deployFixture();
      const aliceGame = await hre.viem.getContractAt("RoadAppGameState", game.address, { client: { wallet: alice } });
      await aliceGame.write.registerPlayer();
      const state = await game.read.getPlayerState([alice.account.address]);
      expect(Number(state.currentPhase)).to.equal(1);
    });

    it("reverts double registration", async () => {
      const { game, alice } = await deployFixture();
      const aliceGame = await hre.viem.getContractAt("RoadAppGameState", game.address, { client: { wallet: alice } });
      await aliceGame.write.registerPlayer();
      await expect(aliceGame.write.registerPlayer()).to.be.rejected;
    });

    it("recordBossDefeat works in OPEN mode (no trustedSigner)", async () => {
      const { game, nft, alice } = await deployFixture();
      const aliceGame = await hre.viem.getContractAt("RoadAppGameState", game.address, { client: { wallet: alice } });
      await aliceGame.write.registerPlayer();
      // deadline ignored in OPEN mode, signature ignored too
      await aliceGame.write.recordBossDefeat([1n, 0n, "0x"]);
      const state = await game.read.getPlayerState([alice.account.address]);
      expect(state.hasDefeatedPhase1).to.equal(true);
      // 1 boss card + 1 reward = 2 minted
      expect(await nft.read.balanceOf([alice.account.address])).to.equal(2n);
    });
  });

  // ---------------- EIP-712 anti-cheat ----------------

  describe("GameState anti-cheat (EIP-712)", () => {
    it("rejects invalid signature when trustedSigner is set", async () => {
      const { game, alice, signer } = await deployFixture();
      await game.write.setTrustedSigner([signer.account.address]);

      const aliceGame = await hre.viem.getContractAt("RoadAppGameState", game.address, { client: { wallet: alice } });
      await aliceGame.write.registerPlayer();

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);
      await expect(
        aliceGame.write.recordBossDefeat([1n, deadline, "0xdead"])
      ).to.be.rejected;
    });

    it("accepts valid EIP-712 signature", async () => {
      const { game, alice, signer, publicClient } = await deployFixture();
      await game.write.setTrustedSigner([signer.account.address]);
      const aliceGame = await hre.viem.getContractAt("RoadAppGameState", game.address, { client: { wallet: alice } });
      await aliceGame.write.registerPlayer();

      const chainId = await publicClient.getChainId();
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);
      const nonce = await game.read.getNonce([alice.account.address]);

      const signature = await signer.signTypedData({
        domain: {
          name: "RoadAppGameState",
          version: "1",
          chainId,
          verifyingContract: game.address,
        },
        types: {
          BossDefeat: [
            { name: "player", type: "address" },
            { name: "phase", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        primaryType: "BossDefeat",
        message: {
          player: getAddress(alice.account.address),
          phase: 1n,
          nonce: nonce,
          deadline: deadline,
        },
      });

      await aliceGame.write.recordBossDefeat([1n, deadline, signature]);
      const state = await game.read.getPlayerState([alice.account.address]);
      expect(state.hasDefeatedPhase1).to.equal(true);
    });
  });

  // ---------------- DeckManager ----------------

  describe("DeckManager", () => {
    it("rejects deck containing cards you don't own", async () => {
      const { deck, nft, alice, bob } = await deployFixture();
      const aliceNft = await hre.viem.getContractAt("RoadAppNFTCards", nft.address, { client: { wallet: alice } });
      await aliceNft.write.mintStarterPack([alice.account.address]); // mints tokenIds 1..4 to alice

      const bobDeck = await hre.viem.getContractAt("RoadAppDeckManager", deck.address, { client: { wallet: bob } });
      await expect(bobDeck.write.saveDeck([[1n, 2n]])).to.be.rejected;
    });

    it("rejects deck smaller than MIN_DECK_SIZE", async () => {
      const { deck, nft, alice } = await deployFixture();
      const aliceNft = await hre.viem.getContractAt("RoadAppNFTCards", nft.address, { client: { wallet: alice } });
      await aliceNft.write.mintStarterPack([alice.account.address]);
      const aliceDeck = await hre.viem.getContractAt("RoadAppDeckManager", deck.address, { client: { wallet: alice } });
      await expect(aliceDeck.write.saveDeck([[1n]])).to.be.rejected;
    });

    it("rejects deck with nonexistent tokenIds with a friendly error", async () => {
      const { deck, alice } = await deployFixture();
      const aliceDeck = await hre.viem.getContractAt("RoadAppDeckManager", deck.address, { client: { wallet: alice } });
      await expect(aliceDeck.write.saveDeck([[42n, 43n]])).to.be.rejected;
    });

    it("clearDeck wipes the saved deck", async () => {
      const { deck, nft, alice } = await deployFixture();
      const aliceNft = await hre.viem.getContractAt("RoadAppNFTCards", nft.address, { client: { wallet: alice } });
      await aliceNft.write.mintStarterPack([alice.account.address]);
      const aliceDeck = await hre.viem.getContractAt("RoadAppDeckManager", deck.address, { client: { wallet: alice } });
      await aliceDeck.write.saveDeck([[1n, 2n, 3n, 4n]]);
      await aliceDeck.write.clearDeck();
      const saved = (await deck.read.getActiveDeck([alice.account.address])) as bigint[];
      expect(saved.length).to.equal(0);
      expect(await deck.read.validateDeck([alice.account.address])).to.equal(false);
    });

    it("rejects duplicates", async () => {
      const { deck, nft, alice } = await deployFixture();
      const aliceNft = await hre.viem.getContractAt("RoadAppNFTCards", nft.address, { client: { wallet: alice } });
      await aliceNft.write.mintStarterPack([alice.account.address]);

      const aliceDeck = await hre.viem.getContractAt("RoadAppDeckManager", deck.address, { client: { wallet: alice } });
      await expect(aliceDeck.write.saveDeck([[1n, 1n]])).to.be.rejected;
    });

    it("accepts a valid deck and validateDeck returns true", async () => {
      const { deck, nft, alice } = await deployFixture();
      const aliceNft = await hre.viem.getContractAt("RoadAppNFTCards", nft.address, { client: { wallet: alice } });
      await aliceNft.write.mintStarterPack([alice.account.address]);

      const aliceDeck = await hre.viem.getContractAt("RoadAppDeckManager", deck.address, { client: { wallet: alice } });
      await aliceDeck.write.saveDeck([[1n, 2n, 3n, 4n]]);
      expect(await deck.read.validateDeck([alice.account.address])).to.equal(true);
    });
  });
});
