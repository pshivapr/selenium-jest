import { faker } from '@faker-js/faker';

export class FakeTestDataGenerator {
    static generateUserData() {
        const timestamp = Date.now();
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            phone: faker.phone.number(),
            ssn: faker.string.numeric(9),
            username: `user_${timestamp}_${faker.string.alphanumeric(5)}`,
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
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            phone: faker.phone.number(),
            ssn: faker.string.numeric(9),
            username: '', // Missing username
            password: 'Test@1234',
        };
    }
}
