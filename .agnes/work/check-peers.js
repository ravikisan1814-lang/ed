const fs = require('fs');
const path = require('path');
const pkgs = ['@react-three/rapier', 'postprocessing', '@react-spring/three', '@use-gesture/react', '@react-three/postprocessing'];
for (const p of pkgs) {
  const f = path.join(process.cwd(), 'node_modules', p, 'package.json');
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  console.log(`\n=== ${p}@${j.version} ===`);
  console.log('peerDependencies:', JSON.stringify(j.peerDependencies || {}, null, 2));
  if (j.peerDependenciesMeta) console.log('peerMeta:', JSON.stringify(j.peerDependenciesMeta));
}
