const { createPublicClient, http, parseAbi } = require('viem');

const client = createPublicClient({ transport: http('https://forno.celo.org') });

const gameStateAddress = '0x0def64e521992e40b4f8757f0e7843641bfb71d8';
const nftCardsAddress = '0x7adf3b31eb190c1d46c3035d7d725ab61230e35b';

const gameStateAbi = parseAbi([
  'function trustedSigner() view returns (address)',
  'function nftContract() view returns (address)',
]);

const nftCardsAbi = parseAbi([
  'function authorizedMinters(address) view returns (bool)',
]);

async function main() {
  console.log('Querying Celo Mainnet...');

  const signer = await client.readContract({
    address: gameStateAddress,
    abi: gameStateAbi,
    functionName: 'trustedSigner',
  });
  console.log('trustedSigner:', signer);

  const nftContractAddr = await client.readContract({
    address: gameStateAddress,
    abi: gameStateAbi,
    functionName: 'nftContract',
  });
  console.log('nftContract:', nftContractAddr);

  const isMinter = await client.readContract({
    address: nftCardsAddress,
    abi: nftCardsAbi,
    functionName: 'authorizedMinters',
    args: [gameStateAddress],
  });
  console.log('Is GameState an authorized minter?', isMinter);
}

main().catch(console.error);
