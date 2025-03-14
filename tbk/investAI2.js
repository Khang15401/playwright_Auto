const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: false }); // Set headless: true for CI/CD
  const context = await browser.newContext();
  const page = await context.newPage();

  // Load session data from session.json
  const sessionData = JSON.parse(fs.readFileSync('session.json', 'utf8'));
  await context.addCookies(sessionData.cookies || []); // Assuming cookies are stored
  await page.evaluate((storage) => {
    for (const [key, value] of Object.entries(storage)) {
      sessionStorage.setItem(key, value);
    }
  }, sessionData.sessionStorage || {});

  // Step 1: Navigate to the system's homepage
  await page.goto('https://tbk-tau.vercel.app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500); // 1500ms delay

  // Step 2: Locate and click the 'Investment' button (assuming it's on the homepage)
  await page.click('xpath=//*[@id="scrollcontainer"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[1]/div/div/div/div/div[2]/div/span'); // Choose Token Button as proxy for Investment flow
  await page.waitForTimeout(1500);

  // Step 3: Verify investment pop-up opens and contains numerical input field
  const inputField = await page.locator('xpath=//*[@id="scrollcontainer"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[1]/div/input');
  const isInputVisible = await inputField.isVisible();
  console.log('Investment pop-up with numerical input field visible:', isInputVisible);
  if (!isInputVisible) throw new Error('Investment pop-up or input field not found');
  await page.waitForTimeout(1500);

  // Step 4: Select 'USDT' as the investment currency
  await page.click('xpath=//*[@id="scrollcontainer"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[1]/div/div/div/div/div[2]/div/span'); // Choose Token Button
  await page.waitForTimeout(1500);
  await page.click('xpath=/html/body/div[3]/div/div/div/div[2]/div[1]'); // Select USDT Token
  await page.waitForTimeout(1500);

  // Step 5: Enter '10' into the numerical input field
  await inputField.fill('10');
  console.log('Entered 10 USDT into the investment field');
  await page.waitForTimeout(1500);

  // Step 6: Click the 'Invest' button
  await page.click('xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/button');
  await page.waitForTimeout(1500);

  // Step 7: Wait for notification or confirmation message
  await page.waitForSelector('xpath=//*[@id=":r1c:"]/div[2]/div/div[3]/button', { timeout: 10000 }); // Assuming Confirm Button indicates notification
  await page.click('xpath=//*[@id=":r1c:"]/div[2]/div/div[3]/button'); // Click Confirm if needed
  await page.waitForTimeout(1500);

  // Step 8: Verify notification content
  const notificationText = await page.textContent('body'); // Adjust locator if notification has a specific XPath
  const hasInvestmentOrSuccess = /investment|success/i.test(notificationText);
  const hasInvestOrSuccess = /invest|success/i.test(notificationText);
  const isNotificationValid = hasInvestmentOrSuccess && hasInvestOrSuccess;
  console.log('Notification text:', notificationText);
  console.log('Notification contains required words:', isNotificationValid);
  await page.waitForTimeout(1500);

  // Step 9: Report investment success
  const investmentSuccessful = isNotificationValid;
  console.log('Investment successful:', investmentSuccessful);

  // Step 10: Check status and log result
  await page.click('xpath=//*[@id="scroll-container"]/div/div[2]/header/div[2]/div[2]'); // Activity Button
  await page.waitForTimeout(1500);
  await page.click('xpath=/html/body/div[3]/div/div[2]/div/div[2]/div/div[1]/div/div[1]/div'); // First Activity Item
  await page.waitForTimeout(1500);
  const statusText = await page.textContent('xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div[2]/div/div[2]/div/div/div[2]/div[2]/span[2]');
  console.log('Investment status:', statusText);
  await page.waitForTimeout(1500);

  // Step 11: Take a screenshot
  await page.screenshot({ path: 'investment_result.png', fullPage: true });
  console.log('Screenshot taken: investment_result.png');

  // Step 12: After checking status, take another screenshot and close browser
  await page.screenshot({ path: 'final_status.png', fullPage: true });
  console.log('Final screenshot taken: final_status.png');
  await browser.close();
})();