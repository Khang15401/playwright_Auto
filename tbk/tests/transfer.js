const { chromium } = require("playwright");
const browserService = require("../eviroment/browser-service");

(async () => {
  let page = null;

  try {
    const page = await browserService.initBrowser("dev", "./session.json");
    await page.waitForTimeout(5000);

    const assetPage = await page.locator(
      'xpath=//*[@id="scroll-container"]/div/div[1]/div/div/div/div[2]/a[2]'
    );
    await assetPage.click();
    await page.waitForTimeout(1500);
  } catch (error) {
    await browserService.closeBrowser();
  }
})();
