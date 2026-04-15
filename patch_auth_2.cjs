const fs = require('fs');

// Patch Register.tsx
let registerData = fs.readFileSync('src/pages/Register.tsx', 'utf8');

registerData = registerData.replace(
  /Rooted in the ancient botanical wisdom of Ceylon, we curate rituals that transcend time\. Every vessel tells a story of provenance, authenticity, and the pursuit of refined well-being\./g,
  'Get the best deals on international personal care brands. Build your daily routine with our affordable, authentic products.'
);

registerData = registerData.replace(
  /Ceylon's Finest Apothecary/g,
  'Affordable Personal Care'
);

fs.writeFileSync('src/pages/Register.tsx', registerData);
