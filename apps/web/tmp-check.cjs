/* eslint-disable */
(async () => {
  const { createPublicClient, http, toFunctionSelector } = require('viem');
  const client = createPublicClient({ transport: http('https://forno.celo.org') });

  const targets = {
    GameState: '0xc977c3c1c48c0a24eff78c866f7fed7bfe5a1ff5',
    NFTCards:  '0x3e3adfd56091511e2e572e40cbb424d3bda54ca6',
    DeckMgr:   '0x0233dad6871a563e052cc3a3681264f8e0ce37cb',
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
