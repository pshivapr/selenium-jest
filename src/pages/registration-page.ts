import { By, WebDriver } from 'selenium-webdriver';
import { BasePage } from './base-page';

export class RegistrationPage extends BasePage {
    private readonly registerLink = By.linkText('Register');
    private readonly firstNameInput = By.id('customer.firstName');
    private readonly lastNameInput = By.id('customer.lastName');
    private readonly addressInput = By.id('customer.address.street');
    private readonly cityInput = By.id('customer.address.city');
    private readonly stateInput = By.id('customer.address.state');
    private readonly zipCodeInput = By.id('customer.address.zipCode');
    private readonly phoneInput = By.id('customer.phoneNumber');
    private readonly ssnInput = By.id('customer.ssn');
    private readonly usernameInput = By.id('customer.username');
    private readonly passwordInput = By.id('customer.password');
    private readonly confirmPasswordInput = By.id('repeatedPassword');
    private readonly registerButton = By.xpath('//input[@value="Register"]');
    private readonly welcomeMessage = By.xpath('//h1[@class="title"]');
    private readonly successMessage = By.xpath('//p[contains(text(), "Your account was created successfully")]');
    private readonly errorMessage = By.xpath('//span[@class="error"]');
    private readonly usernameError = By.id('customer.username.errors');
    private readonly passwordError = By.id('customer.password.errors');

    constructor(driver: WebDriver) {
        super(driver);
    }

    async assertRegistrationPage(): Promise<void> {
        await this.assertPageSnapshot();
    }

    async navigateToRegistrationPage(): Promise<void> {
        await this.navigateTo('/index.htm');
        await this.click(this.registerLink);
        await this.waitForElementVisible(this.firstNameInput);
    }

    async fillRegistrationForm(userData: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        phone: string;
        ssn: string;
        username: string;
        password: string;
    }): Promise<void> {
        await this.type(this.firstNameInput, userData.firstName);
        await this.type(this.lastNameInput, userData.lastName);
        await this.type(this.addressInput, userData.address);
        await this.type(this.cityInput, userData.city);
        await this.type(this.stateInput, userData.state);
        await this.type(this.zipCodeInput, userData.zipCode);
        await this.type(this.phoneInput, userData.phone);
        await this.type(this.ssnInput, userData.ssn);
        await this.type(this.usernameInput, userData.username);
        await this.type(this.passwordInput, userData.password);
        await this.type(this.confirmPasswordInput, userData.password);
    }

    async clickRegisterButton(): Promise<void> {
        await this.click(this.registerButton);
        await this.sleep(2000);
    }

    async isRegistrationSuccessful(): Promise<boolean> {
        try {
            await this.sleep(1000);
            const currentUrl = await this.getCurrentUrl();

            if (currentUrl.includes('overview') || currentUrl.includes('openaccount')) {
                return true;
            }

            await this.waitForElementVisible(this.welcomeMessage, 5000);
            const welcomeText = await this.getText(this.welcomeMessage);
            return welcomeText.toLowerCase().includes('welcome');
        } catch (error) {
            const errors = await this.getErrorMessages();
            console.log('Registration errors:', errors);
            return false;
        }
    }

    async getSuccessMessage(): Promise<string> {
        try {
            return await this.getText(this.successMessage);
        } catch (error) {
            return '';
        }
    }

    async getWelcomeMessage(): Promise<string> {
        try {
            return await this.getText(this.welcomeMessage);
        } catch (error) {
            return '';
        }
    }

    async getErrorMessages(): Promise<string[]> {
        try {
            const errors = await this.findElements(this.errorMessage);
            const errorTexts: string[] = [];
            for (const error of errors) {
                const text = await error.getText();
                if (text.trim()) {
                    errorTexts.push(text.trim());
                }
            }
            return errorTexts;
        } catch (error) {
            return [];
        }
    }

    async isUsernameErrorDisplayed(): Promise<boolean> {
        return await this.isDisplayed(this.usernameError);
    }

    async isPasswordErrorDisplayed(): Promise<boolean> {
        return await this.isDisplayed(this.passwordError);
    }

    async getUsernameError(): Promise<string> {
        try {
            return await this.getText(this.usernameError);
        } catch (error) {
            return '';
        }
    }

    async getPasswordError(): Promise<string> {
        try {
            return await this.getText(this.passwordError);
        } catch (error) {
            return '';
        }
    }
}
