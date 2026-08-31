const fs = require('fs');
const path = require('path');
// check nested copies
const nested = ['node_modules/@react-three/rapier/node_modules/@dimforge/rapier3d-compat',
                'frontend/node_modules/@dimforge/rapier3d-compat'];
for (const n of nested) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(process.cwd(), n, 'package.json'), 'utf8'));
    console.log(n, '=>', j.version);
  } catch (e) { console.log(n, '=> not present'); }
}
// lockfile resolution
const lock = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package-lock.json'), 'utf8'));
for (const key of Object.keys(lock.packages || {}).filter(k => k.includes('rapier3d-compat') || k.includes('@react-three/rapier'))) {
  console.log(key, '=>', lock.packages[key].version);
}
// what does drei need?
const drei = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'node_modules/@react-three/drei/package.json'), 'utf8'));
console.log('drei deps containing rapier/stdlib:', Object.entries(drei.dependencies||{}).filter(([k]) => k.includes('rapier') || k.includes('stdlib')));
console.log('drei optionalDeps:', Object.entries(drei.optionalDependencies||{}).filter(([k]) => k.includes('rapier') || k.includes('stdlib')));
