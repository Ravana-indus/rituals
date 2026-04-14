const fs = require('fs');
let config = JSON.parse(fs.readFileSync('tsconfig.json', 'utf-8'));
delete config.compilerOptions.exclude;
config.exclude = ["supabase/functions/**/*"];
fs.writeFileSync('tsconfig.json', JSON.stringify(config, null, 2));
