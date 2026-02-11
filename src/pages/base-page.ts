import { WebDriver, By, until, WebElement } from 'selenium-webdriver';
import { config } from '../config/test-config';

export abstract class BasePage {
    protected driver: WebDriver;
    protected baseUrl: string;

    constructor(driver: WebDriver) {
        this.driver = driver;
        this.baseUrl = config.baseUrl;
    }

    async navigateTo(path: string = ''): Promise<void> {
        const url = path ? `${this.baseUrl}${path}` : this.baseUrl;
        await this.driver.get(url);
    }

    async findElement(locator: By): Promise<WebElement> {
        await this.waitForElement(locator);
        return await this.driver.findElement(locator);
    }

    async findElements(locator: By): Promise<WebElement[]> {
        return await this.driver.findElements(locator);
    }

    async click(locator: By): Promise<void> {
        const element = await this.findElement(locator);
        await element.click();
    }

    async type(locator: By, text: string): Promise<void> {
        const element = await this.findElement(locator);
        await element.clear();
        await element.sendKeys(text);
    }

    async getText(locator: By): Promise<string> {
        const element = await this.findElement(locator);
        return await element.getText();
    }

    async isDisplayed(locator: By): Promise<boolean> {
        try {
            const element = await this.findElement(locator);
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    async waitForElement(locator: By, timeout: number = config.timeout): Promise<WebElement> {
        return await this.driver.wait(
            until.elementLocated(locator),
            timeout,
            `Element not found: ${locator.toString()}`
        );
    }

    async waitForElementVisible(locator: By, timeout: number = config.timeout): Promise<void> {
        const element = await this.waitForElement(locator, timeout);
        await this.driver.wait(
            until.elementIsVisible(element),
            timeout,
            `Element not visible: ${locator.toString()}`
        );
    }

    async getTitle(): Promise<string> {
        return await this.driver.getTitle();
    }

    async getCurrentUrl(): Promise<string> {
        return await this.driver.getCurrentUrl();
    }

    async sleep(milliseconds: number): Promise<void> {
        await this.driver.sleep(milliseconds);
    }

    async takeScreenshot(fileName: string): Promise<void> {
        const screenshot = await this.driver.takeScreenshot();
        const fs = require('fs');
        const path = require('path');
        const screenshotsDir = path.resolve(__dirname, '../screenshots');
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir);
        }
        const filePath = path.join(screenshotsDir, fileName);
        fs.writeFileSync(filePath, screenshot, 'base64');
    }

    async assertPageSnapshot(): Promise<void> {
        const pageText = await this.getText(By.css('body'));
        expect(pageText).toMatchSnapshot();
    }

    async assertLocatorSnapshot(locator: By): Promise<void> {
        const elementText = await this.getText(locator);
        expect(elementText).toMatchSnapshot();
    }

}
