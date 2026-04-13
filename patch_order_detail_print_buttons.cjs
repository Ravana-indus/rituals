const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/OrderDetailPage.tsx', 'utf-8');

const buttonsHtml = `
          <button onClick={() => window.open(\`/admin/print/invoice/\${order.id}\`, '_blank')} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-2" title="Print Invoice">
            <Icon name="receipt" className="text-lg" />
            <span className="text-sm hidden sm:inline">Invoice</span>
          </button>
          <button onClick={() => window.open(\`/admin/print/sticker/\${order.id}\`, '_blank')} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-2" title="Print Sticker">
            <Icon name="local_shipping" className="text-lg" />
            <span className="text-sm hidden sm:inline">Sticker</span>
          </button>
        </div>
        <button onClick={() => navigate('/admin/orders')} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-2">`;

content = content.replace(
  /<\/div>\n        <button onClick=\{\(\) => navigate\('\/admin\/orders'\)\} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-2">/,
  `        <div className="flex gap-2">` + buttonsHtml
);

fs.writeFileSync('src/pages/admin/OrderDetailPage.tsx', content);
