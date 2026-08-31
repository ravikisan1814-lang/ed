const fs = require('fs');
const j = JSON.parse(fs.readFileSync('node_modules/@react-three/rapier/package.json', 'utf8'));
console.log('rapier peerDeps:', JSON.stringify(j.peerDependencies || {}));
console.log('rapier deps:', JSON.stringify(j.dependencies || {}));
