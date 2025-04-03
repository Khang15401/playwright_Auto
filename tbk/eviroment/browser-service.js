const { chromium } = require("playwright");

// Define environments
const environments = {
  dev: "https://tbk-tau.vercel.app/",
  stg: "https://tbk-git-stage-teknix.vercel.app/",
  prod: "https://tbk-production.vercel.app/",
};

// Global variables to store browser instance
let browserInstance = null;
let contextInstance = null;
let pageInstance = null;

/**
 * Initialize browser and navigate to selected environment
 * @param {string} env - Environment shortname (dev, stg, sb, prod)
 * @returns {Promise<Page>} - Returns Page object
 */
async function initBrowser(env = "dev") {
  console.log(`Initializing browser for environment: ${env}`);

  // Check if environment exists
  if (!environments[env]) {
    throw new Error(`Environment "${env}" does not exist in configuration`);
  }

  const baseUrl = environments[env];
  console.log(`URL for environment ${env}: ${baseUrl}`);

  try {
    // Initialize browser if not exists
    if (!browserInstance) {
      console.log("Starting browser instance initialization...");
      browserInstance = await chromium.launch({
        headless: false,
        slowMo: 50, // Add small delay for better tracking
      });

      contextInstance = await browserInstance.newContext({
        storageState: "session.json",
      });

      pageInstance = await contextInstance.newPage();
    }

    // Navigate to URL
    console.log(`Navigating to ${baseUrl}...`);
    await pageInstance.goto(baseUrl, { timeout: 20000 });
    console.log(`Successfully navigated to ${baseUrl} ✅`);

    return pageInstance;
  } catch (error) {
    console.error("Error during browser initialization:", error);
    throw error;
  }
}

/**
 * Close browser
 */
async function closeBrowser() {
  if (browserInstance) {
    console.log("Closing browser...");
    await browserInstance.close();
    browserInstance = null;
    contextInstance = null;
    pageInstance = null;
    console.log("Browser has been closed successfully");
  }
}

/**
 * Switch between environments
 * @param {string} env - Environment shortname (dev, stg, sb, prod)
 * @returns {Promise<void>}
 */
async function switchEnvironment(env) {
  if (!environments[env]) {
    throw new Error(`Environment "${env}" does not exist in configuration`);
  }

  if (pageInstance) {
    const url = environments[env];
    console.log(`Switching to environment ${env}: ${url}`);
    await pageInstance.goto(url, { timeout: 30000 });
    console.log(`Successfully switched to environment ${env}`);
  } else {
    console.error("Page instance has not been initialized");
    throw new Error("Page instance has not been initialized");
  }
}

/**
 * Get current URL based on environment
 * @param {string} env - Environment shortname
 * @returns {string} - URL of the environment
 */
function getEnvironmentUrl(env) {
  if (!environments[env]) {
    throw new Error(`Environment "${env}" does not exist in configuration`);
  }
  return environments[env];
}

module.exports = {
  initBrowser,
  closeBrowser,
  switchEnvironment,
  getEnvironmentUrl,
  environments,
};
