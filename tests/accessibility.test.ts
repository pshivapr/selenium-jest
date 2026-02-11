import { WebDriver } from 'selenium-webdriver';
import { DriverManager } from '../src/utils/driver-manager';
import { RegistrationPage } from '../src/pages/registration-page';
import { AccessibilityHelper } from '../src/utils/accessibility-helper';

describe('ParaBank Accessibility Tests', () => {
    let driver: WebDriver;
    let registrationPage: RegistrationPage;

    beforeAll(async () => {
        driver = await DriverManager.getDriver();
        AccessibilityHelper.ensureReportsDirectory();
    });

    beforeEach(async () => {
        registrationPage = new RegistrationPage(driver);
    });

    afterAll(async () => {
        await DriverManager.quitDriver();
    });

    test('should have no accessibility violations on registration page', async () => {
        await registrationPage.navigateToRegistrationPage();
        await registrationPage.sleep(2000);

        const result = await AccessibilityHelper.runAccessibilityScan(
            driver,
            'registration-page-a11y.html'
        );

        expect(result.criticalViolations.length).toBe(0);
    });

    test('should have no accessibility violations on home page', async () => {
        await driver.get('https://parabank.parasoft.com/parabank/index.htm');
        await registrationPage.sleep(2000);

        const result = await AccessibilityHelper.runAccessibilityScan(
            driver,
            'home-page-a11y.html'
        );

        expect(result.criticalViolations.length).toBe(0);
    });
});

