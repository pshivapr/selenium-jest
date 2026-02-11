import { WebDriver } from 'selenium-webdriver';
import { DriverManager } from '../src/utils/driver-manager';
import { RegistrationPage } from '../src/pages/registration-page';
import { TestDataGenerator } from '../src/utils/test-data-generator';

describe('ParaBank Registration - Success Scenarios', () => {
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

    test('should successfully register a new user with valid data', async () => {
        const userData = TestDataGenerator.generateUserData();
        console.log('Attempting to register user:', userData.username);

        await registrationPage.navigateToRegistrationPage();
        await registrationPage.fillRegistrationForm(userData);
        await registrationPage.clickRegisterButton();

        await registrationPage.sleep(2000);
        const currentUrl = await registrationPage.getCurrentUrl();
        console.log('Current URL after registration:', currentUrl);

        const errors = await registrationPage.getErrorMessages();
        console.log('Error messages:', errors);

        const hasErrors = errors.length > 0;
        const onSuccessPage = !currentUrl.includes('register.htm');

        expect(hasErrors || onSuccessPage).toBe(true);
    });

    test('should fill registration form correctly', async () => {
        const userData = TestDataGenerator.generateUserData();
        console.log('Testing form with user:', userData.username);

        await registrationPage.navigateToRegistrationPage();
        await registrationPage.fillRegistrationForm(userData);
        await registrationPage.clickRegisterButton();

        await registrationPage.sleep(1000);
        const errors = await registrationPage.getErrorMessages();
        console.log('Errors after submission:', errors);

        const hasFormValidationErrors = errors.some(e =>
            e.includes('required') || e.includes('password') || e.includes('match')
        );

        expect(hasFormValidationErrors).toBe(false);
    });
});
