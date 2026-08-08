import { faker } from '@faker-js/faker';

export const getRandomFirstname = () => {
    return faker.person.firstName();
};
export const getRandomLastname = () => {
    return faker.person.lastName();
};
export const getRandomEmail = () => {
    return faker.internet.email();
};
export const getRandomStreet = () => {
    return faker.location.streetAddress();
};
export const getRandomCity = () => {
    return faker.location.city();
};
export const getRandomState = () => {
    return faker.location.state();
};
export const getRandomZipcode = () => {
    return faker.location.zipCode();
};
export const getRandomPhonenumber = () => {
    return faker.phone.number();
};