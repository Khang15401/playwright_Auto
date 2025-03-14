const { chromium } = require('playwright'); // Import Playwright library

(async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to the homepage
  await page.goto('https://tbk-tau.vercel.app/');
  
  // Wait for a short time to ensure page has loaded
  await page.waitForTimeout(1500); 

  // Click on the 'Investment' button
  await page.click('xpath=//*[@id="scrollcontainer"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[1]/div/div/div/div/div[2]/div/span');
  await page.waitForTimeout(1500); // Wait for the popup to appear

  // Verify that the investment pop-up contains the numerical input field
  const inputField = await page.$('xpath=//*[@id="scrollcontainer"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[1]/div/input');
  if (!inputField) {
    console.log("Investment input field not found.");
    await browser.close();
    return;
  }

  // Click to select USDT as the investment currency
  await page.click('xpath=/html/body/div[3]/div/div/div/div[2]/div[1]');
  await page.waitForTimeout(1500); // Wait for the currency selection to happen
  
  // Enter '10' into the numerical input field for investment
  await page.fill('xpath=//*[@id="scrollcontainer"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[1]/div/input', '10');
  await page.waitForTimeout(1500); // Wait for the input to be entered
  
  // Click the 'Invest' button
  await page.click('xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/button');
  await page.waitForTimeout(1500); // Wait for the transaction to be processed
  
  // Wait for the confirmation or notification message
  const notification = await page.waitForSelector('xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div[2]/div/div[2]/div/div/div[2]/div[2]/span[2]');
  
  // Get the content of the notification
  const notificationText = await notification.innerText();
  
  // Check if the notification contains 'investment' or 'success' and 'invest' or 'success'
  if (notificationText.includes('investment') || notificationText.includes('success')) {
    if (notificationText.includes('invest') || notificationText.includes('success')) {
      console.log('Investment successful!');
    } else {
      console.log('Investment failed: Incorrect confirmation message.');
    }
  } else {
    console.log('Investment failed: No valid confirmation message.');
  }

  // Take a screenshot of the current page (post-investment status)
  await page.screenshot({ path: 'investment_result.png' });

  // Log the status text
  const statusText = await page.$('xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div[2]/div/div[2]/div/div/div[2]/div[2]/span[2]');
  const status = await statusText.innerText();
  console.log('Investment Status:', status);

  // Wait before closing the browser
  await page.waitForTimeout(1500);

  // Close the browser
  await browser.close();
})();
