export class TestDataGenerator {
    private static randomString(length: number): string {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    private static randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static generateUserData() {
        const timestamp = Date.now();
        const random = this.randomString(10);
        const uniqueId = this.randomNumber(10000, 99999);
        return {
            firstName: `Test${this.randomString(6)}`,
            lastName: `User${this.randomString(6)}`,
            address: `${this.randomNumber(100, 9999)} Main Street`,
            city: `City${this.randomString(4)}`,
            state: `State${this.randomString(2)}`,
            zipCode: `${this.randomNumber(10000, 99999)}`,
            phone: `555${this.randomNumber(1000000, 9999999)}`,
            ssn: `${this.randomNumber(100000000, 999999999)}`,
            username: `user${uniqueId}${random}${timestamp}`,
            password: 'Test@1234',
        };
    }

    static generateInvalidUserData() {
        return {
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            phone: '',
            ssn: '',
            username: '',
            password: '',
        };
    }

    static generatePartialUserData() {
        const timestamp = Date.now();
        return {
            firstName: `Test${this.randomString(6)}`,
            lastName: `User${this.randomString(6)}`,
            address: `${this.randomNumber(100, 9999)} Main Street`,
            city: `City${this.randomString(4)}`,
            state: `State${this.randomString(2)}`,
            zipCode: `${this.randomNumber(10000, 99999)}`,
            phone: `555${this.randomNumber(1000000, 9999999)}`,
            ssn: `${this.randomNumber(100000000, 999999999)}`,
            username: '', // Missing username
            password: 'Test@1234',
        };
    }
}
