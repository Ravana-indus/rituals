const fs = require('fs');

let loginData = fs.readFileSync('src/pages/Login.tsx', 'utf8');
loginData = loginData.replace(/The Heritage Curator/g, 'Rituals.lk');
fs.writeFileSync('src/pages/Login.tsx', loginData);

let registerData = fs.readFileSync('src/pages/Register.tsx', 'utf8');
registerData = registerData.replace(/The Heritage Curator/g, 'Rituals.lk');
fs.writeFileSync('src/pages/Register.tsx', registerData);
