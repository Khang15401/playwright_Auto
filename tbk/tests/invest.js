const { chromium } = require("playwright");
const {
  Eyes,
  VisualGridRunner,
  Target,
} = require("@applitools/eyes-playwright");
const dotenv = require("dotenv");
dotenv.config();
let eyes;

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "session.json",
    // viewport: { width: 1420, height: 860 },
  });
  const page = await context.newPage();

  //   const eyes = new Eyes(new VisualGridRunner({ testConcurrency: 5 }));
  // eyes = new Eyes();
  // eyes.setApiKey(process.env.APPLITOOLS_API_KEY);

  try {
    //   await page.setViewportSize({ width: 1500, height: 800 });
    //   await page.evaluate(() => document.documentElement.requestFullscreen());
    await page.goto("https://tbk-tau.vercel.app/");
    // await page.click(
    //   'xpath=//*[@id="scroll-container"]/div/div[1]/div/div/div/div[2]/a[3]'
    // );

    const chooseToken = await page.click(
      'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[1]/div/div/div/div/div[2]/div/span'
    );
    await page.waitForTimeout(1500);

    const tokenUSDT = await page.click(
      "xpath=/html/body/div[3]/div/div/div/div[2]/div[1]"
    );
    await page.waitForTimeout(1500);

    const inputNumber = await page.click(
      'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[1]/div/input'
    );
    const enterNumber = await page.fill(
      'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[1]/div/input',
      "0.5"
    );
    await page.waitForTimeout(1000);

    const invest = await page.click(
      'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/button'
    );
    await page.waitForTimeout(1000);

    const confirm = await page.click(
      'xpath=//*[@id=":r1c:"]/div[2]/div/div[3]/button'
    );
    await page.waitForTimeout(10000);

    const closeBtn = await page.click('xpath=//*[@id=":r1c:"]/div[2]/div/div[3]/button');
    await page.waitForTimeout(1000);

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

      // Lấy nội dung văn bản từ phần tử
      const statusText = await page.textContent(
        'xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div[2]/div/div[2]/div/div/div[2]/div[2]/span[2]'
      );
      console.log(statusText);

      // Kiểm tra trạng thái
      if (
        statusText.trim() &&
        statusText.trim().toLowerCase().includes("success")
      ) {
        console.log("Test Case Passed ✅");
        await page.screenshot({ path: "screenshot.png" });
      } else {
        console.error("Transaction Failed ❌");
        console.error("Current Status:", statusText);
        await page.screenshot({ path: "screenshot.png" });
      }
    } catch (error) {
      console.error("Cannot check transaction status:", error);
    }

    // await eyes.check("Organization", Target.window().fully());
    // await eyes.close();

    // await eyes.check("Organization", Target.window().fully());
    // await eyes.close();
  } catch (error) {
    // await browser.close();
  }
})();
