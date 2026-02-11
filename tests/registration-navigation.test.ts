import { WebDriver, By } from 'selenium-webdriver';
import { DriverManager } from '../src/utils/driver-manager';
import { RegistrationPage } from '../src/pages/registration-page';

describe('ParaBank Registration - Page Navigation', () => {
    let driver: WebDriver;
    let registrationPage: RegistrationPage;

    beforeAll(async () => {
        driver = await DriverManager.getDriver();
    });

    beforeEach(async () => {
        registrationPage = new RegistrationPage(driver);
    });

    afterAll(async () => {
        await DriverManager.quitDriver();
    });

    test('should navigate to registration page successfully', async () => {
        await registrationPage.navigateToRegistrationPage();

        const title = await registrationPage.getTitle();
        expect(title).toContain('ParaBanko');

        const currentUrl = await registrationPage.getCurrentUrl();
        expect(currentUrl).toContain('register.htm');

        await registrationPage.assertRegistrationPage();
    });

    test('should display all registration form fields', async () => {
        await registrationPage.navigateToRegistrationPage();

        await expect(registrationPage.isDisplayed(By.id('customer.firstName'))).resolves.toBe(true);
        await expect(registrationPage.isDisplayed(By.id('customer.lastName'))).resolves.toBe(true);
        await expect(registrationPage.isDisplayed(By.id('customer.address.street'))).resolves.toBe(true);
        await expect(registrationPage.isDisplayed(By.id('customer.username'))).resolves.toBe(true);
        await expect(registrationPage.isDisplayed(By.id('customer.password'))).resolves.toBe(true);
    });
});
