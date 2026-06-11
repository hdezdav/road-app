const { createPublicClient, http } = require('viem');
const nftArtifact = require('./src/lib/abi/RoadAppNFTCards.json');

const client = createPublicClient({ transport: http('https://forno.celo.org') });

const nftCardsAddress = '0x7adf3b31eb190c1d46c3035d7d725ab61230e35b';
const playerAddress = '0x0419F23541408EEcab6EC4Bd96a454EE8A1dD1BE';

async function main() {
  console.log(`Checking cards for player: ${playerAddress}...`);

  const balance = await client.readContract({
    address: nftCardsAddress,
    abi: nftArtifact.abi,
    functionName: 'balanceOf',
    args: [playerAddress],
  });
  console.log('balanceOf:', balance.toString());

  const owned = await client.readContract({
    address: nftCardsAddress,
    abi: nftArtifact.abi,
    functionName: 'getOwnedCards',
    args: [playerAddress],
  });

  console.log(`getOwnedCards returned ${owned.length} cards:`);
  for (const card of owned) {
    console.log(`- TokenId: ${card.tokenId}, Catalog ID: ${card.cardCatalogId}, Attack: ${card.attack}, Defense: ${card.defense}`);
  }
}

main().catch(console.error);
