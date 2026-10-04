import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import {
    getRandomCity,
    getRandomEmail,
    getRandomFirstname,
    getRandomInfo,
    getRandomLastname,
    getRandomPhonenumber,
    getRandomSecondaryAddress,
    getRandomState,
    getRandomStreetAddress,
    getRandomZipcode
} from "./fake-input.util";

vi.mock("@faker-js/faker", () => ({
    faker: {
        person: {
            firstName: vi.fn(),
            lastName: vi.fn()
        },
        internet: {
            email: vi.fn()
        },
        location: {
            streetAddress: vi.fn(),
            secondaryAddress: vi.fn(),
            city: vi.fn(),
            state: vi.fn(),
            zipCode: vi.fn()
        },
        phone: {
            number: vi.fn()
        },
        lorem: {
            words: vi.fn()
        }
    }
}));

const cases = [
    {
        name: "getRandomFirstname",
        fn: getRandomFirstname,
        fakerFn: vi.mocked(faker.person.firstName),
        value: "Jane"
    },
    {
        name: "getRandomLastname",
        fn: getRandomLastname,
        fakerFn: vi.mocked(faker.person.lastName),
        value: "Doe"
    },
    {
        name: "getRandomEmail",
        fn: getRandomEmail,
        fakerFn: vi.mocked(faker.internet.email),
        value: "jane.doe@example.com"
    },
    {
        name: "getRandomStreetAddress",
        fn: getRandomStreetAddress,
        fakerFn: vi.mocked(faker.location.streetAddress),
        value: "123 Main Street"
    },
    {
        name: "getRandomSecondaryAddress",
        fn: getRandomSecondaryAddress,
        fakerFn: vi.mocked(faker.location.secondaryAddress),
        value: "Apt. 4B"
    },
    {
        name: "getRandomCity",
        fn: getRandomCity,
        fakerFn: vi.mocked(faker.location.city),
        value: "Springfield"
    },
    {
        name: "getRandomState",
        fn: getRandomState,
        fakerFn: vi.mocked(faker.location.state),
        value: "Illinois"
    },
    {
        name: "getRandomZipcode",
        fn: getRandomZipcode,
        fakerFn: vi.mocked(faker.location.zipCode),
        value: "62704"
    },
    {
        name: "getRandomPhonenumber",
        fn: getRandomPhonenumber,
        fakerFn: vi.mocked(faker.phone.number),
        value: "(555) 123-4567"
    },
    {
        name: "getRandomInfo",
        fn: getRandomInfo,
        fakerFn: vi.mocked(faker.lorem.words),
        value: "lorem ipsum dolor"
    }
];

describe("fake input utilities", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it.each(cases)("$name returns the value from faker", ({ fn, fakerFn, value }) => {
        fakerFn.mockReturnValue(value);

        const result = fn();

        expect(result).toBe(value);
        expect(fakerFn).toHaveBeenCalledTimes(1);
    });

    it.each(cases)("$name returns a string", ({ fn, fakerFn }) => {
        fakerFn.mockReturnValue("generated-value");

        expect(typeof fn()).toBe("string");
    });
});
