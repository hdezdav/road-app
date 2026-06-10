const fs = require('fs');
const path = require('path');

// v2 (post-merge): solo 2 contratos. DeckManager se fusionó dentro de GameState.
const contracts = [
  { name: 'RoadAppNFTCards', path: 'contracts/RoadAppNFTCards.sol/RoadAppNFTCards.json' },
  { name: 'RoadAppGameState', path: 'contracts/RoadAppGameState.sol/RoadAppGameState.json' }
];

const sourceDir = path.join(__dirname, '../apps/contracts/artifacts');
const targetDir = path.join(__dirname, '../apps/web/src/lib/abi');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

contracts.forEach(contract => {
  const srcPath = path.join(sourceDir, contract.path);
  const destPath = path.join(targetDir, `${contract.name}.json`);
  
  if (fs.existsSync(srcPath)) {
    const data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
    fs.writeFileSync(destPath, JSON.stringify({ abi: data.abi }, null, 2));
    console.log(`Copied ABI for ${contract.name}`);
  } else {
    console.error(`Source not found: ${srcPath}`);
  }
});
