const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/Analytics.tsx', 'utf-8');

// Fix 1: Analytics type casting
content = content.replace(/formatPriceCents\(amount\)/, `formatPriceCents(amount as number)`);
content = content.replace(/amount \/ totalRevenue/, `(amount as number) / totalRevenue`);

fs.writeFileSync('src/pages/admin/Analytics.tsx', content);

let ordersContent = fs.readFileSync('src/pages/admin/Orders.tsx', 'utf-8');
ordersContent = ordersContent.replace(/\{selectedOrderId && \([\s\S]*?\}\)/g, '');
fs.writeFileSync('src/pages/admin/Orders.tsx', ordersContent);
