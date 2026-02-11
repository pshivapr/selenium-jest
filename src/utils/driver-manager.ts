import { Builder, WebDriver, Capabilities } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';
import { config } from '../config/test-config';
import * as path from 'path';

export class DriverManager {
    private static drivers: Map<number, WebDriver> = new Map();

    private static getWorkerId(): number {
        return process.env.JEST_WORKER_ID ? parseInt(process.env.JEST_WORKER_ID) : 0;
    }

    static async getDriver(): Promise<WebDriver> {
        const workerId = this.getWorkerId();

        if (!this.drivers.has(workerId)) {
            const driver = await this.createDriver();
            this.drivers.set(workerId, driver);
        }

        return this.drivers.get(workerId)!;
    }

    private static async createDriver(): Promise<WebDriver> {
        const browser = config.browser.toLowerCase();
        const builder = new Builder();

        const chromedriverPath = path.join(
            process.cwd(),
            'node_modules',
            'chromedriver',
            'lib',
            'chromedriver',
            process.platform === 'win32' ? 'chromedriver.exe' : 'chromedriver'
        );

        switch (browser) {
            case 'chrome':
                const chromeService = new chrome.ServiceBuilder(chromedriverPath);
                const chromeOptions = new chrome.Options();
                if (config.headless) {
                    chromeOptions.addArguments('--headless=new');
                }
                chromeOptions.addArguments('--no-sandbox');
                chromeOptions.addArguments('--disable-dev-shm-usage');
                chromeOptions.addArguments('--disable-gpu');
                chromeOptions.addArguments('--window-size=1920,1080');
                chromeOptions.addArguments('--disable-extensions');
                chromeOptions.addArguments('--disable-software-rasterizer');

                builder
                    .forBrowser('chrome')
                    .setChromeService(chromeService)
                    .setChromeOptions(chromeOptions);
                break;

            case 'firefox':
                const firefoxOptions = new firefox.Options();
                if (config.headless) {
                    firefoxOptions.addArguments('--headless');
                }
                firefoxOptions.addArguments('--width=1920');
                firefoxOptions.addArguments('--height=1080');
                builder.forBrowser('firefox').setFirefoxOptions(firefoxOptions);
                break;

            default:
                throw new Error(`Unsupported browser: ${browser}`);
        }

        return await builder.build();
    }

    static async quitDriver(): Promise<void> {
        const workerId = this.getWorkerId();
        const driver = this.drivers.get(workerId);

        if (driver) {
            try {
                await driver.quit();
            } catch (error) {
                console.warn(`Error quitting driver for worker ${workerId}:`, error);
            } finally {
                this.drivers.delete(workerId);
            }
        }
    }

    static async quitAllDrivers(): Promise<void> {
        const quitPromises = Array.from(this.drivers.entries()).map(async ([workerId, driver]) => {
            try {
                await driver.quit();
            } catch (error) {
                console.warn(`Error quitting driver for worker ${workerId}:`, error);
            }
        });

        await Promise.all(quitPromises);
        this.drivers.clear();
    }
}
