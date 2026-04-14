const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/OrderDetailPage.tsx', 'utf-8');

const oldBlock = `        <div>
          <h2 className="text-xl font-noto-serif text-primary">Order {order.order_number}</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">{order.created_at ? new Date(order.created_at).toLocaleString('en-LK') : '—'}</p>
                <div className="flex gap-2">
          <button onClick={() => window.open(\`/admin/print/invoice/\${order.id}\`, '_blank')} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-2" title="Print Invoice">
            <Icon name="receipt" className="text-lg" />
            <span className="text-sm hidden sm:inline">Invoice</span>
          </button>
          <button onClick={() => window.open(\`/admin/print/sticker/\${order.id}\`, '_blank')} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-2" title="Print Sticker">
            <Icon name="local_shipping" className="text-lg" />
            <span className="text-sm hidden sm:inline">Sticker</span>
          </button>
        </div>
        <button onClick={() => navigate('/admin/orders')} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-2">
          <Icon name="arrow_back" className="text-lg" />
          <span className="text-sm">Back</span>
        </button>
      </div>`;

const newBlock = `        <div>
          <h2 className="text-xl font-noto-serif text-primary">Order {order.order_number}</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">{order.created_at ? new Date(order.created_at).toLocaleString('en-LK') : '—'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.open(\`/admin/print/invoice/\${order.id}\`, '_blank')} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-2" title="Print Invoice">
            <Icon name="receipt" className="text-lg" />
            <span className="text-sm hidden sm:inline">Invoice</span>
          </button>
          <button onClick={() => window.open(\`/admin/print/sticker/\${order.id}\`, '_blank')} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-2" title="Print Sticker">
            <Icon name="local_shipping" className="text-lg" />
            <span className="text-sm hidden sm:inline">Sticker</span>
          </button>
          <button onClick={() => navigate('/admin/orders')} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-2">
            <Icon name="arrow_back" className="text-lg" />
            <span className="text-sm">Back</span>
          </button>
        </div>
      </div>`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync('src/pages/admin/OrderDetailPage.tsx', content);
