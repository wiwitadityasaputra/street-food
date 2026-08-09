import { cookies } from 'next/headers';
import { faker } from '@faker-js/faker';

export const COOKIES_KEY = "street-food-cookie";

export interface CookieDataInterface {
    userId: string;
}

export async function getCookieData(): Promise<CookieDataInterface> {
    const userCookies = (await cookies()).get(COOKIES_KEY);
    if (userCookies && userCookies.value) {
        const str = userCookies.value;
        const cookieData: CookieDataInterface = JSON.parse(str);
        return cookieData;
    }
    return {
        userId: faker.string.uuid()
    };
}

export async function cookiesGetUserId(): Promise<string> {
    const cookieData = await getCookieData();
    return cookieData.userId;
}

export async function cookiesSetUserId(userId: string): Promise<void> {
    const cookieData: CookieDataInterface = {
        userId: userId
    };
    (await cookies()).set(COOKIES_KEY, JSON.stringify(cookieData));
}