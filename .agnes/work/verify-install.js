const fs = require('fs');
const path = require('path');
const pkgs = [
  '@react-three/rapier', 'postprocessing', '@react-spring/three',
  '@use-gesture/react', '@react-three/postprocessing',
  '@dimforge/rapier3d-compat', 'n8ao', '@react-spring/core',
  '@use-gesture/core', 'suspend-react', 'maath', 'three-stdlib'
];
for (const p of pkgs) {
  const f = path.join(process.cwd(), 'node_modules', p, 'package.json');
  try {
    console.log(p, JSON.parse(fs.readFileSync(f, 'utf8')).version);
  } catch (e) {
    console.log(p, 'MISSING');
  }
}
console.log('---package.json deps---');
const j = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'frontend', 'package.json'), 'utf8'));
for (const k of Object.keys(j.dependencies)) {
  if (pkgs.includes(k) || k.includes('rapier') || k.includes('spring') || k.includes('gesture') || k.includes('postprocessing')) {
    console.log(k, j.dependencies[k]);
  }
}
