const browserService = require("../eviroment/browser-service");
const { test } = require("playwright/test");

(async () => {
  let page = null;

  try {
    const page = await browserService.initBrowser("stg");
    await page.waitForTimeout(5000);

    const assetPage = await page.locator(
      'xpath=//*[@id="scroll-container"]/div[2]/div/div[1]/div[1]'
    );

    await assetPage.click();

    const getBalanceUSDT = await page.textContent(
      '//div[contains(@id, "tabpanel-personal")]/div[3]/div[3]/div[3]/div[2]/span[1]/div/div/span[2]'
    );

    console.log("Balance before convert:", getBalanceUSDT);
    await page.waitForTimeout(3000);

    const transferSession = await page.locator(
      '//button[contains(@id, "-tab-gift_premium")]'
    );
    await transferSession.click();
    await page.waitForTimeout(1500);

    const inputFriend = await page.locator('div[id*="tabpanel-gift_premium"] >> input');

    await inputFriend.click();
    await inputFriend.fill("bakery");
    await page.waitForTimeout(2000);

    // const chooseUser = await page.click(
    //   'div[contains(@id, "tabpanel-gift_premium")]/div/div/div[2]/div[2]/div'
    // );

    const chooseUser = await page.click(
      '//div[contains(@id, "tabpanel-gift_premium")]/div/div/div[2]/div[2]/div'
    );
    
    await page.waitForTimeout(1000);
    

    const btnChoose = await page.locator(
      '//div[contains(@id,"tabpanel-transfer")]/div/div[1]/div[2]/div/div/div/div'
    );
 
    await btnChoose.click();
    await page.waitForTimeout(1500);

    const tokenUSDT = await page.locator(
      "xpath=/html/body/div[3]/div/div/div/div[2]/div[1]"
    );
    await tokenUSDT.click();
    
    await page.waitForTimeout(1000);

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

    const confirmBtn = await page.locator('xpath=//*[@id="scroll-container"]/div[1]/div/div[2]/div/div[2]/div/div[2]/div/div/div[3]/button');
    
    await confirmBtn.click();
    await page.waitForTimeout(7000);
    // await confirmBtn.click();
    // await page.waitForTimeout(1000);
    
    const buttonCloseTransfer = await page.locator('xpath=//*[@id="scroll-container"]/div[1]/div/div[2]/div/div[2]/div/div[2]/div/div/button');
    await buttonCloseTransfer.click();
    await page.waitForTimeout(3000)
    //*[@id="scroll-container"]/div[1]/div/div[2]/div/div[2]/div/div[2]/div/div/button

    const btnClose = await page.locator('xpath=//*[@id="scroll-container"]/div[1]/div/div[2]/div[1]/div[3]/button[2]')
    await btnClose.click();
    await page.waitForTimeout(10000)

    await assetPage.click();
    await page.waitForTimeout(5000);

    const getBalanceAfterTransfer = await page.textContent(
      '//div[contains(@id, "tabpanel-personal")]/div[3]/div[3]/div[3]/div[2]/span[1]/div/div/span[2]'
    );
    console.log("Balance after transfer:", getBalanceAfterTransfer);
    var balanceTransfer = JSON.parse(getBalanceUSDT)
    var balanceAfterTransfer = JSON.parse(getBalanceAfterTransfer)
    
    if ( balanceTransfer > balanceAfterTransfer){
      console.log("Balance updated is successful");
    } else{
      console.log("Convert WAB to USDT Failed!");
    }

    // if (getBalanceAfterTransfer > getBalanceUSDT + numberTransfer) {
    //   console.log("Balance updated is successful");
    // } else {
    //   if (getBalanceAfterTransfer === getBalanceUSDT)
    //     console.log("Convert WAB to USDT Failed!");
    // }

    // Pending to fix transfer in sandbox
  } catch (error) {
    // await browserService.closeBrowser();
  }
})();
