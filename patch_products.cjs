const fs = require('fs');

const files = [
  'src/pages/RitualBuilder.tsx',
  'src/pages/CuratedSelection.tsx',
  'src/pages/ProductDetail.tsx',
  'src/pages/Category.tsx',
  'src/pages/SearchResults.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let data = fs.readFileSync(file, 'utf8');

    data = data.replace(/The Heritage Curator/g, 'Rituals.lk');
    data = data.replace(/Thrifty Luxury, Rooted in Tradition\./g, 'Affordable Personal Care.');
    data = data.replace(/Ethically sourced in Sri Lanka\./g, 'Affordable Personal Care.');
    data = data.replace(/The Ritual Builder/g, 'Build Your Routine');
    data = data.replace(/Complete Your Ritual/g, 'Build Your Routine');
    data = data.replace(/Add Ritual/g, 'Add Routine');
    data = data.replace(/Modify Your Ritual/g, 'Modify Your Routine');
    data = data.replace(/Rituals/g, 'Routines');
    data = data.replace(/Ritual Foundation/g, 'Routine Foundation');
    data = data.replace(/Hair Ritual Collection/g, 'Hair Care Routine');
    data = data.replace(/Skin Ritual Collection/g, 'Skin Care Routine');
    data = data.replace(/Fragrance Ritual Collection/g, 'Fragrance Routine');
    data = data.replace(/Add to Ritual/g, 'Add to Routine');
    data = data.replace(/Added to Ritual/g, 'Added to Routine');
    data = data.replace(/Complete Ritual/g, 'Complete Routine');
    data = data.replace(/Your Ritual/g, 'Your Routine');
    data = data.replace(/Ritual Bundle Discount/g, 'Routine Bundle Discount');

    fs.writeFileSync(file, data);
  }
});
