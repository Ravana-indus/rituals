const fs = require('fs');

let contactData = fs.readFileSync('src/pages/Contact.tsx', 'utf8');

contactData = contactData.replace(/The Heritage Curator/g, 'Rituals.lk');
contactData = contactData.replace(/concierge@heritagecurator\.com/g, 'hello@rituals.lk');
contactData = contactData.replace(/Whether you seek a bespoke wellness ritual or have inquiries regarding our heirloom apothecary, our concierge is here to guide your journey\. Step into our digital sanctuary for personalized assistance\./g, 'Whether you are looking for specific international brands or need help building your daily personal care routine, our team is here to help.');
contactData = contactData.replace(/Apothecary Concierge/g, 'Customer Support');
contactData = contactData.replace(/Connect with the Curator/g, 'Contact Us');
contactData = contactData.replace(/Your Essence \(Name\)/g, 'Your Name');
contactData = contactData.replace(/Digital Path \(Email\)/g, 'Email Address');
contactData = contactData.replace(/Your Inquiry/g, 'Your Message');
contactData = contactData.replace(/\* We aim to respond within one lunar cycle of your inquiry\./g, '* We aim to respond within 24 hours.');
contactData = contactData.replace(/Speak with a Curator/g, 'Speak with our Team');
contactData = contactData.replace(/Direct Correspondence/g, 'Email Us');
contactData = contactData.replace(/The Physical Sanctuary/g, 'Visit Us');
contactData = contactData.replace(/Experience the ritual in person at our flagship apothecary\./g, 'Find your favorite affordable personal care products at our store.');
contactData = contactData.replace(/Visual Chronicles/g, 'Social Media');
contactData = contactData.replace(/Respecting the Ritual/g, 'Affordable Personal Care');
contactData = contactData.replace(/Every formulation and artifact is curated with meticulous attention to Sri Lankan heritage\. We ensure that your journey with us is as authentic as the traditions we preserve\./g, 'We are committed to bringing you the best international brands at affordable prices. Authentic products for your daily routine.');
contactData = contactData.replace(/Handcrafted in Sri Lanka\./g, 'Affordable Personal Care in Sri Lanka.');
contactData = contactData.replace(/Handcrafted Heritage/g, 'Affordable Personal Care');

fs.writeFileSync('src/pages/Contact.tsx', contactData);
