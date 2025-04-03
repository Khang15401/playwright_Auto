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

    await page.waitForTimeout(3000);

    const transferSession = await page.locator(
      '//button[contains(@id, "-tab-gift_premium")]'
    );
    await transferSession.click();
    await page.waitForTimeout(1500);

    const inputFriend = await page.locator(
      'div[id*="tabpanel-gift_premium"] >> input'
    );

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

    const confirmBtn = await page.locator(
      'xpath=//*[@id="scroll-container"]/div[1]/div/div[2]/div/div[2]/div/div[2]/div/div/div[3]/button'
    );

    await confirmBtn.click();
    await page.waitForTimeout(10000);
    // await confirmBtn.click();
    // await page.waitForTimeout(1000);

    const buttonCloseTransfer = await page.locator(
      'xpath=//*[@id="scroll-container"]/div[1]/div/div[2]/div/div[2]/div/div[2]/div/div/button'
    );
    await buttonCloseTransfer.click();
    await page.waitForTimeout(2500);
    //*[@id="scroll-container"]/div[1]/div/div[2]/div/div[2]/div/div[2]/div/div/button

    const getStatusTrans = await page.locator(
      'xpath=//*[@id="scroll-container"]/div[1]/div/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/span[2]'
    );
    //*[@id="scroll-container"]/div[1]/div/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/span[2]

    const statusText = await getStatusTrans.textContent();
    const status = statusText.trim();
    await page.waitForTimeout(2000);
    // console.log("Transaction status:", status);
    const arrStatus = [
      "Success",
      "सफलता",
      "성공",
      "Sucesso",
      "Успех",
      "Thành công",
      "成功",
    ];

    if (arrStatus.includes(status)) {
      const btnClose = await page.locator(
        'xpath=//*[@id="scroll-container"]/div[1]/div/div[2]/div[1]/div[3]/button[2]'
      );
      await btnClose.click();
      await page.waitForTimeout(10000);

      await assetPage.click();
      await page.waitForTimeout(7000);

      const getBalanceAfterTransfer = await page.textContent(
        '//div[contains(@id, "tabpanel-personal")]/div[3]/div[3]/div[3]/div[2]/span[1]/div/div/span[2]'
      );

      // Convert string values to numbers and remove any commas/spaces
      const balanceBeforeTransfer = parseFloat(
        getBalanceUSDT.replace(/,/g, "")
      );
      const balanceAfterTransfer = parseFloat(
        getBalanceAfterTransfer.replace(/,/g, "")
      );

      console.log("Balance before (number):", balanceBeforeTransfer);
      console.log("Balance after (number):", balanceAfterTransfer);

      // Compare the numbers
      if (balanceBeforeTransfer > balanceAfterTransfer) {
        console.log("✅ Transfer successful - Balance decreased as expected");
        console.log(
          `Balance decreased by: ${(
            balanceBeforeTransfer - balanceAfterTransfer
          ).toFixed(2)}`
        );
      } else {
        console.log("❌ Transfer failed - Balance did not decrease");
        console.log(
          `Balance difference: ${(
            balanceAfterTransfer - balanceBeforeTransfer
          ).toFixed(2)}`
        );
      }
    } else {
      console.log("❌ Transfer failed");
    }
  } catch (error) {
    console.log("❌ Test failed:", error.message);
    await browserService.closeBrowser();
  } finally {
    await browserService.closeBrowser();
  }
})();
