const fs = require('fs');

const files = [
  'src/pages/Cart.tsx',
  'src/pages/Checkout.tsx',
  'src/pages/TrackOrder.tsx',
  'src/pages/OrderConfirmed.tsx',
  'src/pages/PaymentError.tsx'
];

files.forEach(file => {
  let data = fs.readFileSync(file, 'utf8');

  data = data.replace(/The Heritage Curator/g, 'Rituals.lk');
  data = data.replace(/High-End Apothecary & Rituals/g, 'Affordable Personal Care');
  data = data.replace(/Crafted with Intent\./g, 'Affordable Personal Care.');
  data = data.replace(/Crafted with intention\./g, 'Affordable Personal Care.');
  data = data.replace(/Heritage Curator/g, 'Rituals.lk');
  data = data.replace(/Ethically Sourced, Artfully Curated\./g, 'Affordable Personal Care.');
  data = data.replace(/Ethically sourced in Sri Lanka\./g, 'Affordable Personal Care.');
  data = data.replace(/High-End Editorial Beauty\./g, 'Affordable Personal Care Sri Lanka.');
  data = data.replace(/Handcrafted in Sri Lanka\./g, 'Affordable Personal Care in Sri Lanka.');
  data = data.replace(/Supporting artisan communities across Sri Lanka\./g, 'Bringing international brands to Sri Lanka.');
  data = data.replace(/Your Ritual Collection/g, 'Your Cart');
  data = data.replace(/Your ritual collection is empty/g, 'Your cart is empty');
  data = data.replace(/Trace Your Ritual/g, 'Track Your Order');
  data = data.replace(/Searching your ritual.../g, 'Searching your order...');
  data = data.replace(/No Rituals Found/g, 'No Orders Found');
  data = data.replace(/Ritual Prepared/g, 'Order Prepared');
  data = data.replace(/Items curated in our Galle Fort apothecary\./g, 'Items prepared for delivery.');
  data = data.replace(/ritual found/gi, 'order found');
  data = data.replace(/rituals found/gi, 'orders found');
  data = data.replace(/Ritual Tracking Number/g, 'Order Tracking Number');
  data = data.replace(/ritualist@example\.com/g, 'hello@rituals.lk');

  fs.writeFileSync(file, data);
});
