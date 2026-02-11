import { WebDriver } from 'selenium-webdriver';
import * as fs from 'fs';
import * as path from 'path';

export class ScreenshotHelper {
    private static screenshotsDir = path.resolve(process.cwd(), 'test-results/screenshots');

    static ensureScreenshotsDirectory(): void {
        if (!fs.existsSync(this.screenshotsDir)) {
            fs.mkdirSync(this.screenshotsDir, { recursive: true });
        }
    }

    static async captureScreenshot(
        driver: WebDriver,
        testName: string,
        reason: string = 'failure'
    ): Promise<string> {
        this.ensureScreenshotsDirectory();

        const sanitizedName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const timestamp = Date.now();
        const filename = `${reason}_${sanitizedName}_${timestamp}.png`;
        const filepath = path.join(this.screenshotsDir, filename);

        try {
            const screenshot = await driver.takeScreenshot();
            fs.writeFileSync(filepath, screenshot, 'base64');

            const relativePath = path.relative(
                path.resolve(process.cwd(), 'test-results'),
                filepath
            );

            console.log(`📸 Screenshot captured: ${relativePath}`);
            return relativePath;
        } catch (error) {
            console.error('Failed to capture screenshot:', error);
            throw error;
        }
    }

    static getScreenshotsDirectory(): string {
        return this.screenshotsDir;
    }
}
