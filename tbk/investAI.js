const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    // Launch browser
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        storageState: "session.json",
        // viewport: { width: 1420, height: 860 },
    });
    const page = await context.newPage();

    try {
        // Step 1: Load session data and navigate to homepage
        console.log('Step 1: Loading session data and navigating to homepage');

        // Read session data from file
        // const sessionData = JSON.parse(fs.readFileSync(path.join(__dirname, 'session.json'), 'utf8'));

        // // Set session storage
        await page.goto('https://tbk-tau.vercel.app/');
        // await page.evaluate((sessionData) => {
        //   for (const [key, value] of Object.entries(sessionData)) {
        //     sessionStorage.setItem(key, value);
        //   }
        // }, sessionData);

        // // Reload page to apply session data
        // await page.reload();
        await page.waitForTimeout(1500);

        // Step 2: Click the Investment button
        console.log('Step 2: Clicking the Investment button');
        const investmentButton = page.locator('text=Investment').first();
        await investmentButton.click();
        await page.waitForTimeout(1500);

        // Step 3: Verify investment pop-up window and input field
        console.log('Step 3: Verifying investment pop-up window');
        const inputField = page.locator('xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[1]/div/input');
        const isInputVisible = await inputField.isVisible();
        console.log(`Investment input field visible: ${isInputVisible}`);
        await page.waitForTimeout(1500);

        // Step 4: Select USDT as investment currency
        console.log('Step 4: Selecting USDT as investment currency');
        const tokenButton = page.locator('xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[1]/div/div/div/div/div[2]/div/span');
        await tokenButton.click();
        await page.waitForTimeout(1500);

        const usdtOption = page.locator('xpath=/html/body/div[3]/div/div/div/div[2]/div[1]');
        await usdtOption.click();
        await page.waitForTimeout(1500);

        // Step 5: Enter 10 into the input field
        console.log('Step 5: Entering investment amount');
        await inputField.fill('10');
        await page.waitForTimeout(1500);

        // Step 6: Click the Invest button
        console.log('Step 6: Clicking the Invest button');
        const investButton = page.locator('xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div/div[3]/div[2]/div/div/div/div/div[4]/button');
        await investButton.click();
        await page.waitForTimeout(1500);

        // Click confirm button if it appears
        const confirmButton = page.locator('xpath=//*[@id=":r1c:"]/div[2]/div/div[3]/button');
        if (await confirmButton.isVisible()) {
            await confirmButton.click();
            await page.waitForTimeout(1500);
        }

        // Step 7: Wait for notification
        console.log('Step 7: Waiting for notification');
        try {
            // Wait for notification - adjust selector as needed
            await page.waitForSelector('.notification, .toast, .alert', { timeout: 10000 });
            await page.waitForTimeout(1500);

            // Step 8: Verify notification content
            console.log('Step 8: Verifying notification content');
            const notificationText = await page.locator('.notification, .toast, .alert').textContent();
            const successKeywords = ['investment', 'success', 'invest', 'successful'];
            const containsSuccessKeywords = successKeywords.some(keyword =>
                notificationText.toLowerCase().includes(keyword.toLowerCase())
            );

            // Step 9: Report investment status
            console.log('Step 9: Reporting investment status');
            console.log(`Notification text: ${notificationText}`);
            console.log(`Investment successful: ${containsSuccessKeywords}`);

        } catch (error) {
            console.log('No standard notification found, checking activity status instead');
        }

        // Step 10: Check status and log result
        console.log('Step 10: Checking status and logging result');

        // Click Activity button to check status
        const activityButton = page.locator('xpath=//*[@id="scroll-container"]/div/div[2]/header/div[2]/div[2]');
        await activityButton.click();
        await page.waitForTimeout(1500);

        // Check first activity item
        const firstActivityItem = page.locator('xpath=/html/body/div[3]/div/div[2]/div/div[2]/div/div[1]/div/div[1]/div');
        await firstActivityItem.click();
        await page.waitForTimeout(1500);

        // Get status text
        const statusText = await page.locator('xpath=//*[@id="scroll-container"]/div/div[2]/div/div[1]/div/div/div[2]/div/div[2]/div/div/div[2]/div[2]/span[2]').textContent();
        console.log(`Investment status: ${statusText}`);

        // Step 11: Take a screenshot
        console.log('Step 11: Taking a screenshot');
        await page.screenshot({ path: 'investment_result.png', fullPage: true });

        console.log('Test completed successfully');

    } catch (error) {
        console.error('Test failed:', error);
        await page.screenshot({ path: 'investment_error.png', fullPage: true });
    } finally {
        // Step 12: Close the browser
        console.log('Step 12: Closing the browser');
        await browser.close();
    }
})();