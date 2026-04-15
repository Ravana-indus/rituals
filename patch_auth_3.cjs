const fs = require('fs');

let loginData = fs.readFileSync('src/pages/Login.tsx', 'utf8');

loginData = loginData.replace(
  /Ceylon's Finest/g,
  'Sri Lanka\'s Finest'
);

loginData = loginData.replace(
  /Ceylon's Finest Apothecary/g,
  'Affordable Personal Care'
);

fs.writeFileSync('src/pages/Login.tsx', loginData);
