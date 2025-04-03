const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://tbk-git-stage-teknix.vercel.app/");
  //   await page.screenshot({ path: 'example.png' });
  //   await browser.close();

  await page.click('xpath=//*[@id="input"]');
  await page.fill('xpath=//*[@id="input"]', "akhang147@gmail.com");

    await page.click('xpath=//*[@id="normal_login"]/div[10]/div[2]/div/div/div/div/div/div/span/span/span[2]/button');

    await page.waitForTimeout(40000);

  // Add this before storageState to debug
  const storage = await context.storageState();
  console.log(JSON.stringify(storage, null, 2));

  await context.storageState({ path: "session.json" });
  await browser.close();
})();
