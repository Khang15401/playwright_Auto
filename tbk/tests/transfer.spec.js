const browserService = require("../eviroment/browser-service");
const { test } = require("playwright/test");

(async () => {
  let page = null;

  try {
    const page = await browserService.initBrowser("dev");
    await page.waitForTimeout(5000);

    const assetPage = await page.locator(
      'xpath=//*[@id="scroll-container"]/div/div[1]/div/div/div/div[2]/a[2]'
    );
    await assetPage.click();

    const getBalanceUSDT = await page.textContent(
      '//div[contains(@id, "tabpanel-personal")]/div[2]/div[3]/div[3]/div[2]/span[1]/div'
    );

    console.log("Balance before convert:", getBalanceUSDT);
    await page.waitForTimeout(3000);

    const transferSession = await page.locator(
      '//button[contains(@id, "-tab-gift_premium")]'
    );
    await transferSession.click();
    await page.waitForTimeout(1500);

    const inputFriend = await page.locator(
      'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div[3]/div[1]/div/div[1]/div[2]/div/input'
    );
    await inputFriend.click();
    await inputFriend.fill("faker10");
    await page.waitForTimeout(2000);

    const chooseUser = await page.click(
      'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div[3]/div[1]/div/div[2]/div[2]/div'
    );
    await page.waitForTimeout(1000);

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

    // const btnChooseToken  = await page.click('//div[contains(@id="-tabpanel-transfer")]/div/div[1]/div[2]/div/div/div/div');

    // const btnChoose = await page.click(
    //   'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[1]/div/div/div/div/div[2]/div/span'
    // );

    // await page.waitForTimeout(1500);

    // const tokenTON = await page.click(
    //   "xpath=/html/body/div[3]/div/div/div/div[2]/div"
    // );
    // await page.waitForTimeout(1000);

    const inputValue = await page.locator(
      '//div[contains(@id,"tabpanel-transfer")]/div/div[1]/div[2]/div/input'
    );
    await inputValue.click();
    await page.waitForTimeout(1000);
    await inputValue.fill("0.5");
    await page.waitForTimeout(500);

    // Fix for the button locator
    const transferBtn = await page.locator(
      '//*[contains(@id,"tabpanel-transfer")]/div/button'
    );
    await transferBtn.click();

    const confirmBtn = await page.locator("//*/div[2]/div/div[3]/button");
    await confirmBtn.click();
    await page.waitForTimeout(6000);
    await confirmBtn.click();
    await page.waitForTimeout(1000);

    await assetPage.click();
    await page.waitForTimeout(1000);

    const getBalanceAfterConvert = await page.textContent(
      '//div[contains(@id, "tabpanel-personal")]/div[2]/div[3]/div[3]/div[2]/span[1]/div/div/span[2]'
    );
    console.log("Balance after convert:", getBalanceAfterConvert);

    if (getBalanceAfterConvert > getBalanceUSDT + numberConvert) {
      console.log("Balance updated is successful");
    } else {
      if (getBalanceAfterConvert === getBalanceUSDT)
        console.log("Convert WAB to USDT Failed!");
    }

    // Pending to fix transfer in sandbox

  } catch (error) {
    // await browserService.closeBrowser();
  }
})();
