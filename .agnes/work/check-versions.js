const fs = require('fs');
const path = require('path');
const roots = ['node_modules', 'frontend/node_modules'];
const pkgs = ['three', '@react-three/fiber', '@react-three/drei', 'react', 'react-dom', 'gsap'];
for (const p of pkgs) {
  let found = null;
  for (const r of roots) {
    const f = path.join(process.cwd(), r, p, 'package.json');
    try {
      const j = JSON.parse(fs.readFileSync(f, 'utf8'));
      found = `${j.version} (${r})`;
      break;
    } catch (e) {}
  }
  console.log(p, found || 'MISSING');
}
