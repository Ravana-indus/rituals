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

    // Fix paths! We can't change the path unless we also rename the file and update routes
    data = data.replace(/\/routine-builder/g, '/ritual-builder');

    // Fix camelCase
    data = data.replace(/handleAddToroutine/g, 'handleAddToRoutine');

    fs.writeFileSync(file, data);
  }
});
