const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Try to mock the auth if we want, but since we will patch the code, it's fine.

  await page.goto('http://localhost:5173/admin/fulfillment');
  await page.waitForTimeout(3000); // Wait for potential data fetching

  await page.screenshot({ path: '/home/jules/verification/verification-fulfillment.png', fullPage: true });

  await browser.close();
})();
