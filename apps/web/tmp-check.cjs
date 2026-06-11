/* eslint-disable */
(async () => {
  const { createPublicClient, http, toFunctionSelector } = require('viem');
  const client = createPublicClient({ transport: http('https://forno.celo.org') });

  const targets = {
    GameState: '0x0def64e521992e40b4f8757f0e7843641bfb71d8',
    NFTCards:  '0x7adf3b31eb190c1d46c3035d7d725ab61230e35b',
  };

  for (const [label, addr] of Object.entries(targets)) {
    console.log('\n====', label, addr, '====');
    const code = await client.getBytecode({ address: addr });
    if (!code) { console.log('NO CODE'); continue; }
    console.log('Bytecode length:', code.length);

    const sels = {
      // GameState - candidate signatures (current + legacy)
      'recordBossDefeat(uint256,uint256,bytes)': null,
      'recordBossDefeat(uint256,bytes)':         null,
      'recordBossDefeat(uint256)':               null,
      'registerPlayer()':                        null,
      'isRegistered(address)':                   null,
      'verifySeedPhraseBackup(uint256,bytes)':   null,
      'verifySeedPhraseBackup()':                null,
      'getPlayerState(address)':                 null,
      'getNonce(address)':                       null,
      'restartPlayer(address)':                  null,
      // NFTCards
      'mintStarterPack(address)':                null,
      'mintBossCard(address,uint256)':           null,
      'mintRewardPack(address,uint256)':         null,
      'hasClaimedStarter(address)':              null,
      'getOwnedCards(address)':                  null,
    };
    for (const sig of Object.keys(sels)) {
      const sel = toFunctionSelector(sig);
      const present = code.includes(sel.slice(2));
      console.log('  ', sig.padEnd(48), sel, present ? 'YES' : 'no');
    }
  }
})().catch(e => { console.error(e); process.exit(1); });
