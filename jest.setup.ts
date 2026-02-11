import { DriverManager } from './src/utils/driver-manager';
import { ScreenshotHelper } from './src/utils/screenshot-helper';

ScreenshotHelper.ensureScreenshotsDirectory();

let testFailed = false;
let currentTestName = '';
let screenshotPath = '';

beforeEach(() => {
    testFailed = false;
    screenshotPath = '';
    currentTestName = expect.getState().currentTestName || 'unknown-test';
});

afterEach(async () => {
    const state = expect.getState();
    const hasFailures = state.assertionCalls > state.numPassingAsserts;

    if (hasFailures || testFailed) {
        try {
            const driver = await DriverManager.getDriver();

            if (driver) {
                screenshotPath = await ScreenshotHelper.captureScreenshot(
                    driver,
                    currentTestName,
                    'failure'
                );

                if ((global as any).testResults) {
                    (global as any).testResults[currentTestName] = {
                        screenshot: screenshotPath
                    };
                }
            }
        } catch (error) {
            console.warn('⚠️  Failed to capture screenshot:', error);
        }
    }
});

const originalIt = global.it;
global.it = ((name: string, fn?: jest.ProvidesCallback, timeout?: number) => {
    if (!fn) {
        return originalIt(name, fn, timeout);
    }

    const wrappedFn = async function (...args: any[]) {
        currentTestName = name;
        try {
            await (fn as any)(...args);
        } catch (error) {
            testFailed = true;
            throw error;
        }
    };

    return originalIt(name, wrappedFn as jest.ProvidesCallback, timeout);
}) as typeof global.it;

if (!(global as any).testResults) {
    (global as any).testResults = {};
}

declare global {
    var testResults: Record<string, { screenshot?: string }>;
}


