const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "session.json",
  });

  const page = await context.newPage();
  const numberConvert = 10;

  try {
    await page.goto("https://tbk-tau.vercel.app/");
    await page.waitForTimeout(5000);

    const assetPage = await page.locator(
      'xpath=//*[@id="scroll-container"]/div/div[1]/div/div/div/div[2]/a[2]'
    );
    await assetPage.click();
    await page.waitForTimeout(1500);

    await page.mouse.move(500, 500); // Move mouse to middle of page
    await page.mouse.wheel(0, 1000); // Scroll down smoothly
    await page.waitForTimeout(1000);

    // Scroll to specific element if needed
    await page.evaluate(() => {
      const element = document.querySelector("#scroll-container");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
    await page.waitForTimeout(1000);

    // Final scroll to ensure we reach bottom
    await page.keyboard.press("End");
    await page.waitForTimeout(1000);

    const getBalanceUSDT = await page.textContent(
      '//div[contains(@id, "tabpanel-personal")]/div[2]/div[3]/div[3]/div[2]/span[1]/div'
    );

    console.log("Balance before convert:", getBalanceUSDT);
    await page.waitForTimeout(1500);

    const convertBtn = await page.click(
      '//div[contains(@id, "tabpanel-personal")]/div[2]/div[3]/div[2]/div[4]/a/span/span'
    );
    await page.waitForTimeout(1500);

    const inputNumConvert = await page.click(
      'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div[2]/div/div/div[1]/div[1]/div/div[1]/span[2]/div/input'
    );
    await page.waitForTimeout(1500);

    const fillValues = await page.fill(
      'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div[2]/div/div/div[1]/div[1]/div/div[1]/span[2]/div/input',
      "100"
    );
    await page.waitForTimeout(500);

    const confirmConvert = await page.click(
      'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div[2]/div/div/button'
    );

    // const popupConfirm = await page.click('div[contains(@text, "Convert")]/div[2]/div/div[3]/button'
    // );
    const popupConfirm = await page.click('button:has-text("Convert")');
    await page.waitForTimeout(3500);
    await page.waitForTimeout(10000);

    await assetPage.click();
    await page.waitForTimeout(1000);

    const getBalanceAfterConvert = await page.textContent(
      '//div[contains(@id, "tabpanel-personal")]/div[2]/div[3]/div[3]/div[2]/span[1]/div/div/span[2]'
    );
    console.log("Balance after convert:", getBalanceAfterConvert);

    if (getBalanceAfterConvert > getBalanceUSDT + numberConvert) {
      console.log("Convert WAB to USDT Success!");
    } else {
      if (getBalanceAfterConvert === getBalanceUSDT)
        console.log("Convert WAB to USDT Failed!");
    }

    const Activity = await page.click(
      'xpath=//*[@id="scroll-container"]/div/div[2]/header/div[2]/div[2]'
    );
    await page.waitForTimeout(1000);

    const showActivity = await page.click(
      "xpath=/html/body/div[3]/div/div[2]/div/div[2]/div/div[1]/div/div[1]/div"
    );
    await page.waitForTimeout(1000);

    try {
      await page.waitForSelector(
        'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div[2]/div/div[2]/div/div/div[2]/div[2]/span[2]',
        { timeout: 3000 }
      );

      const statusText = await page.textContent(
        'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div[2]/div/div[2]/div/div/div[2]/div[2]/span[2]'
      );
      console.log(statusText);

      if (
        statusText.trim() &&
        statusText.trim().toLowerCase().includes("success")
      ) {
        console.log("Test Case Convert Passed ✅");
        await page.screenshot({ path: "screenshot.png" });
      } else {
        console.error("Transaction Convert Failed ❌");
        console.error("Current Status:", statusText);
        await page.screenshot({ path: "screenshot.png" });
      }
    } catch (error) {
      console.error("Cannot check transaction status:", error);
    }

    await browser.close();
  } catch (error) {
    await page.close();
    await browser.close();
  }
})();
