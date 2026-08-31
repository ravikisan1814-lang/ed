const fs = require('fs');
const path = require('path');
const nm = (p) => {
  const f = path.join(process.cwd(), 'node_modules', p, 'package.json');
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  return j;
};
const versions = {
  three: nm('three').version,
  fiber: nm('@react-three/fiber').version,
  react: nm('react').version,
};
console.log('Installed:', JSON.stringify(versions, null, 2));
const peers = [
  ['@react-three/rapier', { three: '>=0.159', fiber: '>=9.0.4', react: '^19' }],
  ['postprocessing', { three: '>=0.168 <0.186' }],
  ['@react-spring/three', { fiber: '>=6.0', react: '^16 || ^17 || ^18 || ^19', three: '>=0.126' }],
  ['@use-gesture/react', { react: '>=16.8' }],
  ['@react-three/postprocessing', { fiber: '>=9.7', postprocessing: '>=6.36', react: '^19' }],
];
for (const [p, expected] of peers) {
  console.log(`\n${p} peer expectations:`, JSON.stringify(expected));
}
// on-disk sizes (KB)
function sizeOf(dir) {
  let total = 0;
  function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const fp = path.join(d, e.name);
      if (e.isDirectory()) walk(fp);
      else total += fs.statSync(fp).size;
    }
  }
  walk(dir);
  return total / 1024;
}
const newPkgs = ['@react-three/rapier', 'postprocessing', '@react-spring/three', '@react-spring/core', '@react-spring/shared', '@react-spring/animated', '@react-spring/types', '@use-gesture/react', '@use-gesture/core', '@react-three/postprocessing', '@dimforge/rapier3d-compat', 'n8ao', 'suspend-react', 'maath', 'three-stdlib'];
let sum = 0;
for (const p of newPkgs) {
  try {
    const s = sizeOf(path.join(process.cwd(), 'node_modules', p));
    sum += s;
    console.log(`${p}: ${s.toFixed(1)} KB`);
  } catch (e) { console.log(`${p}: missing`); }
}
console.log(`\nTotal on-disk (new+transitive): ${(sum/1024).toFixed(2)} MB`);
