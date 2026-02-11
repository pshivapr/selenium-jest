export const config = {
    baseUrl: 'https://parabank.parasoft.com/parabank',
    browser: process.env.BROWSER || 'chrome',
    headless: process.env.HEADLESS !== 'true', // Default to true unless explicitly set to 'false'
    timeout: 30000,
};
