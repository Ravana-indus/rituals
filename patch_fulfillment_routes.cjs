const fs = require('fs');

// Patch App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace(
  /import AdminDashboard from '\.\/pages\/admin\/Dashboard';/,
  `import AdminDashboard from './pages/admin/Dashboard';\nimport AdminFulfillment from './pages/admin/Fulfillment';`
);

appContent = appContent.replace(
  /<Route path="orders" element=\{<AdminOrders \/>\} \/>/,
  `<Route path="fulfillment" element={<AdminFulfillment />} />\n          <Route path="orders" element={<AdminOrders />} />`
);

fs.writeFileSync('src/App.tsx', appContent);

// Patch AdminLayout.tsx
let layoutContent = fs.readFileSync('src/components/AdminLayout.tsx', 'utf-8');
layoutContent = layoutContent.replace(
  /\{ path: '\/admin\/orders', label: 'Orders', icon: 'receipt_long' \},/,
  `{ path: '/admin/orders', label: 'Orders', icon: 'receipt_long' },\n  { path: '/admin/fulfillment', label: 'Fulfillment', icon: 'local_shipping' },`
);

fs.writeFileSync('src/components/AdminLayout.tsx', layoutContent);
