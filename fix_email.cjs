const fs = require('fs');

let data = fs.readFileSync('src/pages/admin/InvoicePrint.tsx', 'utf8');
data = data.replace(/hello@theheritagecurator\.com/g, 'hello@rituals.lk');
data = data.replace(/support@theheritagecurator\.com/g, 'support@rituals.lk');
fs.writeFileSync('src/pages/admin/InvoicePrint.tsx', data);
