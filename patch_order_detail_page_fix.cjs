const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/OrderDetailPage.tsx', 'utf-8');
content = content.replace(/<\/div>\n    <\/div>\n    <\/div>\n  \);\n\}/, `    </div>\n    </div>\n  );\n}`);
fs.writeFileSync('src/pages/admin/OrderDetailPage.tsx', content);
