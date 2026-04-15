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

    // Fix the accidental replacement
    data = data.replace(/Routines\.lk/g, 'Rituals.lk');

    // Add some more specific replacements
    data = data.replace(/Rooted in Ayurvedic tradition and refined for the modern eye\. Select your foundation, nourishment, and finish to curate a ritual that honors your heritage\./g, 'Build your perfect hair care routine with top international brands at the best prices.');
    data = data.replace(/Luxury is not found in the price, but in the time we take to honor ourselves\. These formulas are sourced from generational growers across the island, ensuring that your thrifty choices never compromise on the sacredness of the ritual\./g, 'We believe everyone deserves access to high-quality personal care. Build your routine to unlock bundle discounts on your favorite brands.');
    data = data.replace(/The skin remembers what the mind forgets\. These preparations carry the intelligence of turmeric, saffron, and rose — ingredients that have sustained beauty rituals across the subcontinent for millennia\./g, 'Create a skincare routine tailored to your needs. Mix and match international brands like CeraVe, Cetaphil, and Olay.');

    // Replace remaining references
    data = data.replace(/ritual/gi, 'routine');
    data = data.replace(/Routineist/gi, 'Ritualist'); // Revert some that might have broken
    data = data.replace(/Routines\.lk/gi, 'Rituals.lk'); // Just to be sure

    fs.writeFileSync(file, data);
  }
});
