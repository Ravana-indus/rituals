const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/OrderDetailPage.tsx', 'utf-8');

// Update imports
content = content.replace(
  /import React, \{ useEffect, useRef \} from 'react';/,
  `import React, { useEffect, useRef, useState } from 'react';\nimport { useParams, useNavigate } from 'react-router-dom';`
);

// Update component signature
content = content.replace(
  /export default function OrderDetail\(\{ orderId, onClose \}: Props\) \{/,
  `export default function OrderDetailPage() {\n  const { id } = useParams<{ id: string }>();\n  const navigate = useNavigate();\n  const orderId = id!;`
);

// Remove dialogRef and handleBackdropClick logic
content = content.replace(/const dialogRef = useRef<HTMLDialogElement>\(null\);\n\n  useEffect\(\(\) => \{\n    dialogRef\.current\?\.showModal\(\);\n    loadOrder\(\);\n  \}, \[orderId\]\);/g, `useEffect(() => {\n    loadOrder();\n  }, [orderId]);`);

content = content.replace(/function handleBackdropClick\(e: React.MouseEvent\) \{\n    if \(e.target === dialogRef\.current\) onClose\(\);\n  \}/g, '');

// Update return statement (remove dialog, wrap in a normal div)
content = content.replace(
  /return \(\n      <dialog ref=\{dialogRef\} onClose=\{onClose\} onClick=\{handleBackdropClick\} className="fixed inset-0 m-auto max-w-md w-\[95vw\] max-h-\[90vh\] bg-surface rounded-2xl border border-outline-variant\/10 shadow-2xl backdrop:bg-black\/50 overflow-hidden">\n        <div className="p-8 text-center text-on-surface-variant">\n          \{loading \? 'Loading\.\.\.' : 'Order not found'\}\n        <\/div>\n      <\/dialog>\n    \);/,
  `return (\n      <div className="min-h-screen bg-surface-container-low p-6 flex items-center justify-center">\n        <div className="text-center text-on-surface-variant">\n          {loading ? 'Loading...' : 'Order not found'}\n          <br/>\n          <button onClick={() => navigate('/admin/orders')} className="mt-4 text-primary underline">Back to Orders</button>\n        </div>\n      </div>\n    );`
);

content = content.replace(
  /<dialog ref=\{dialogRef\} onClose=\{onClose\} onClick=\{handleBackdropClick\} className="fixed inset-0 m-auto max-w-lg w-\[95vw\] max-h-\[90vh\] bg-surface rounded-2xl border border-outline-variant\/10 shadow-2xl backdrop:bg-black\/50 overflow-hidden">/,
  `<div className="min-h-screen bg-surface-container-low text-on-surface p-6 space-y-6">\n      <div className="max-w-4xl mx-auto bg-surface rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">`
);

content = content.replace(
  /<\/dialog>/,
  `</div>\n    </div>`
);

content = content.replace(
  /<button onClick=\{onClose\} className="p-1\.5 rounded hover:bg-surface-container-high text-on-surface-variant transition-colors">\n          <Icon name="close" className="text-lg" \/>\n        <\/button>/,
  `<button onClick={() => navigate('/admin/orders')} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-2">\n          <Icon name="arrow_back" className="text-lg" />\n          <span className="text-sm">Back</span>\n        </button>`
);

// Adjust classes to better fit full page
content = content.replace(/className="overflow-y-auto max-h-\[calc\(90vh-140px\)\] p-6 space-y-6"/, `className="p-8 space-y-8"`);

// Add timeline / notes section at bottom
const notesSection = `        </div>

        {/* New feature: Detailed Timeline / Extra Notes */}
        <div className="mt-8 pt-8 border-t border-outline-variant/10">
          <h3 className="text-sm uppercase tracking-widest text-on-surface-variant mb-4">Order Timeline</h3>
          <div className="space-y-4">
             <div className="flex gap-4">
               <div className="flex flex-col items-center">
                 <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                 <div className="w-px h-full bg-outline-variant/20 my-1"></div>
               </div>
               <div>
                 <p className="text-sm font-medium">Order Placed</p>
                 <p className="text-xs text-on-surface-variant">{order.created_at ? new Date(order.created_at).toLocaleString('en-LK') : '—'}</p>
               </div>
             </div>
             {order.status !== 'pending' && (
             <div className="flex gap-4">
               <div className="flex flex-col items-center">
                 <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
               </div>
               <div>
                 <p className="text-sm font-medium">Order {order.status}</p>
                 <p className="text-xs text-on-surface-variant">{order.updated_at ? new Date(order.updated_at).toLocaleString('en-LK') : '—'}</p>
               </div>
             </div>
             )}
          </div>
        </div>`;

content = content.replace(/<\/div>\n    <\/div>\n    <\/div>/g, notesSection + '\n      </div>\n    </div>\n    </div>'); // A bit hacky, lets use a more precise replacement.
content = content.replace(/      <\/div>\n    <\/div>\n  \);\n\}/, `      </div>\n      \n      {/* New feature: Detailed Timeline / Extra Notes */}\n      <div className="p-6 border-t border-outline-variant/10">\n        <h3 className="text-sm uppercase tracking-widest text-on-surface-variant mb-4">Order Timeline</h3>\n        <div className="space-y-4">\n           <div className="flex gap-4">\n             <div className="flex flex-col items-center">\n               <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>\n               <div className="w-px h-full bg-outline-variant/20 my-1"></div>\n             </div>\n             <div>\n               <p className="text-sm font-medium">Order Placed</p>\n               <p className="text-xs text-on-surface-variant">{order.created_at ? new Date(order.created_at).toLocaleString('en-LK') : '—'}</p>\n             </div>\n           </div>\n           {order.status !== 'pending' && (\n           <div className="flex gap-4">\n             <div className="flex flex-col items-center">\n               <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>\n             </div>\n             <div>\n               <p className="text-sm font-medium">Order {order.status}</p>\n               <p className="text-xs text-on-surface-variant">{order.updated_at ? new Date(order.updated_at).toLocaleString('en-LK') : '—'}</p>\n             </div>\n           </div>\n           )}\n        </div>\n      </div>\n      \n    </div>\n    </div>\n  );\n}`);

fs.writeFileSync('src/pages/admin/OrderDetailPage.tsx', content);
