const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

appContent = appContent.replace(
  /import AdminOrderDetailPage from '\.\/pages\/admin\/OrderDetailPage';/,
  `import AdminOrderDetailPage from './pages/admin/OrderDetailPage';\nimport InvoicePrint from './pages/admin/InvoicePrint';\nimport StickerPrint from './pages/admin/StickerPrint';`
);

appContent = appContent.replace(
  /<Route path="\/admin" element=\{<AdminLayout \/>\}>/,
  `<Route path="/admin/print/invoice/:id" element={<InvoicePrint />} />\n        <Route path="/admin/print/sticker/:id" element={<StickerPrint />} />\n        <Route path="/admin" element={<AdminLayout />}>`
);

fs.writeFileSync('src/App.tsx', appContent);
