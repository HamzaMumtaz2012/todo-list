const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const pageErrors = [];

  page.on('pageerror', (err) => pageErrors.push('PAGE_ERROR: ' + err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      pageErrors.push('CONSOLE_ERROR: ' + msg.text());
    }
  });

  await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 5000 });
  await page.getByPlaceholder('Add A Task...').fill('Test Todo');
  await page.getByRole('button').filter({ hasText: '+' }).click();

  await page.getByText('Test Todo').wait({ state: 'attached', timeout: 1500 });

  const total = await page.locator('#empty-state').count();
  const visibleTodos = await page.locator('li').count();
  const bodyText = await page.locator('body').innerText();

  console.log(JSON.stringify({ pageErrors, visibleTodos, bodyText, total }));
  await browser.close();
})();
