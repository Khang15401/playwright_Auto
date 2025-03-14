const { chromium } = require("playwright");

(async () => {
  // Create new context with storage state
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "session.json",
  });
  // Create new page
  const page = await context.newPage();

  try {
    // Access website
    await page.goto("https://tbk-tau.vercel.app/");
    await page.waitForTimeout(1500);

    // Click choose token button
    await page.click(
      'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[1]/div/div/div/div/div[2]/div/span'
    );
    await page.waitForTimeout(1500);

    // Select USDT token
    await page.click("xpath=/html/body/div[3]/div/div/div/div[2]/div[1]");
    await page.waitForTimeout(1500);

    // Enter investment amount
    const inputField = await page.locator(
      'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[1]/div/input'
    );
    await inputField.fill("0.5");
    await page.waitForTimeout(1500);

    // Click Invest button
    await page.click(
      'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/button'
    );
    await page.waitForTimeout(1500);

    // Click confirm button
    await page.click('xpath=//*[@id=":r1c:"]/div[2]/div/div[3]/button');
    await page.waitForTimeout(1500);

    // Navigate to activity page
    await page.click(
      'xpath=//*[@id="scroll-container"]/div/div[2]/header/div[2]/div[2]'
    );
    await page.waitForTimeout(1500);

    // Select first activity
    await page.click(
      "xpath=/html/body/div[3]/div/div[2]/div/div[2]/div/div[1]/div/div[1]/div"
    );
    await page.waitForTimeout(1500);

    // Get transaction status
    const statusElement = await page.locator(
      'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div[2]/div/div[2]/div/div/div[2]/div[2]/span[2]'
    );
    const statusText = await statusElement.innerText();

    // Check status and log result
    if (statusText.toLowerCase().includes("success")) {
      console.log("Test Case Passed ✅");
    } else {
      console.error("Transaction Failed ❌");
      console.error("Current Status:", statusText);
    }

    // Take screenshot
    await page.screenshot({
      path: `./screenshots/investment-test-${Date.now()}.png`,
      fullPage: true,
    });
  } catch (error) {
    console.error("Test failed:", error);
    await page.screenshot({
      path: `./screenshots/error-${Date.now()}.png`,
      fullPage: true,
    });
  } finally {
    // Close context and browser
    await context.close();
    await browser.close();
  }
})();
