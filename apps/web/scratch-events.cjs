const { createPublicClient, http, parseAbi } = require('viem');

const client = createPublicClient({ transport: http('https://forno.celo.org') });

const gameStateAddress = '0x0def64e521992e40b4f8757f0e7843641bfb71d8';

const abi = parseAbi([
  'event BossDefeated(address indexed player, uint256 phase)',
  'event PhaseAdvanced(address indexed player, uint256 newPhase)',
]);

async function main() {
  const currentBlock = await client.getBlockNumber();
  console.log('Current block:', currentBlock.toString());

  // Query events from the last 100,000 blocks (roughly 5 days on Celo)
  const logs = await client.getLogs({
    address: gameStateAddress,
    events: abi,
    fromBlock: currentBlock - 100000n,
  });

  console.log(`Found ${logs.length} events:`);
  for (const log of logs) {
    console.log(`Event: ${log.eventName}, Player: ${log.args.player}, Phase/NewPhase: ${log.args.phase || log.args.newPhase}`);
  }
}

main().catch(console.error);
