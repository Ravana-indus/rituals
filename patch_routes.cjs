const fs = require('fs');

// Patch App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace(
  /import AdminOrders from '\.\/pages\/admin\/Orders';/,
  `import AdminOrders from './pages/admin/Orders';\nimport AdminOrderDetailPage from './pages/admin/OrderDetailPage';`
);

appContent = appContent.replace(
  /<Route path="orders" element=\{<AdminOrders \/>\} \/>/,
  `<Route path="orders" element={<AdminOrders />} />\n          <Route path="orders/:id" element={<AdminOrderDetailPage />} />`
);

fs.writeFileSync('src/App.tsx', appContent);

// Patch AdminOrders.tsx
let ordersContent = fs.readFileSync('src/pages/admin/Orders.tsx', 'utf-8');

ordersContent = ordersContent.replace(/import OrderDetail from '\.\.\/\.\.\/components\/admin\/OrderDetail';\n/, '');
ordersContent = ordersContent.replace(/import React, \{ useEffect, useState \} from 'react';/, `import React, { useEffect, useState } from 'react';\nimport { useNavigate } from 'react-router-dom';`);

ordersContent = ordersContent.replace(
  /export default function AdminOrders\(\) \{/,
  `export default function AdminOrders() {\n  const navigate = useNavigate();`
);

ordersContent = ordersContent.replace(
  /const \[selectedOrderId, setSelectedOrderId\] = useState<string \| null>\(null\);/,
  ``
);

ordersContent = ordersContent.replace(
  /onClick=\{\(\) => setSelectedOrderId\(order\.id\)\}/,
  `onClick={() => navigate(\`/admin/orders/\${order.id}\`)}`
);

ordersContent = ordersContent.replace(
  /\{selectedOrderId && \([\s\S]*?\}\)/,
  ``
);

fs.writeFileSync('src/pages/admin/Orders.tsx', ordersContent);
