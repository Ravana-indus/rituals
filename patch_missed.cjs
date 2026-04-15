const fs = require('fs');

const files = [
  'src/components/Header.tsx',
  'src/components/AdminLayout.tsx',
  'src/pages/Profile.tsx',
  'src/pages/admin/Fulfillment.tsx',
  'src/pages/admin/StickerPrint.tsx',
  'src/pages/admin/InvoicePrint.tsx',
  'src/pages/admin/Dashboard.tsx',
  'src/pages/Home.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let data = fs.readFileSync(file, 'utf8');

    data = data.replace(/The Heritage Curator/g, 'Rituals.lk');
    data = data.replace(/Ceylon's Finest Apothecary/g, 'Affordable Personal Care');
    data = data.replace(/High-End Editorial Beauty/g, 'Affordable Personal Care');

    fs.writeFileSync(file, data);
  }
});
