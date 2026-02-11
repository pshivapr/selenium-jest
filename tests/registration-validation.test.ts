import { WebDriver } from 'selenium-webdriver';
import { DriverManager } from '../src/utils/driver-manager';
import { RegistrationPage } from '../src/pages/registration-page';
import { TestDataGenerator } from '../src/utils/test-data-generator';

describe('ParaBank Registration - Validation Errors', () => {
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

    test('should show validation errors when all fields are empty', async () => {
        const invalidData = TestDataGenerator.generateInvalidUserData();

        await registrationPage.navigateToRegistrationPage();
        await registrationPage.fillRegistrationForm(invalidData);
        await registrationPage.clickRegisterButton();

        await registrationPage.sleep(1000);
        const errorMessages = await registrationPage.getErrorMessages();
        expect(errorMessages.length).toBeGreaterThan(0);
    });

    test('should show error when username is missing', async () => {
        const partialData = TestDataGenerator.generatePartialUserData();

        await registrationPage.navigateToRegistrationPage();
        await registrationPage.fillRegistrationForm(partialData);
        await registrationPage.clickRegisterButton();

        await registrationPage.sleep(1000);
        const hasUsernameError = await registrationPage.isUsernameErrorDisplayed();
        expect(hasUsernameError).toBe(true);

        const usernameError = await registrationPage.getUsernameError();
        expect(usernameError).toBeTruthy();
    });

    test('should show error when passwords do not match', async () => {
        const userData = TestDataGenerator.generateUserData();
        userData.password = 'Password123';

        await registrationPage.navigateToRegistrationPage();
        await registrationPage.fillRegistrationForm(userData);

        const driver = await DriverManager.getDriver();
        const confirmPasswordField = await driver.findElement({ id: 'repeatedPassword' });
        await confirmPasswordField.clear();
        await confirmPasswordField.sendKeys('DifferentPassword');

        await registrationPage.clickRegisterButton();

        await registrationPage.sleep(1000);
        const errorMessages = await registrationPage.getErrorMessages();
        expect(errorMessages.length).toBeGreaterThan(0);
    });
});
