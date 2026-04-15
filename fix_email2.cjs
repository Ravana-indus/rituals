const fs = require('fs');

let paymentData = fs.readFileSync('src/pages/PaymentError.tsx', 'utf8');
paymentData = paymentData.replace(/support@heritagecurator\.com/g, 'support@rituals.lk');
fs.writeFileSync('src/pages/PaymentError.tsx', paymentData);

let orderConfirmedData = fs.readFileSync('src/pages/OrderConfirmed.tsx', 'utf8');
orderConfirmedData = orderConfirmedData.replace(/care@heritagecurator\.com/g, 'hello@rituals.lk');
fs.writeFileSync('src/pages/OrderConfirmed.tsx', orderConfirmedData);

let registerData = fs.readFileSync('src/pages/Register.tsx', 'utf8');
registerData = registerData.replace(/ritualist@heritagecurator\.com/g, 'hello@rituals.lk');
fs.writeFileSync('src/pages/Register.tsx', registerData);
