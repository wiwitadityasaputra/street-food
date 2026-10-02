import { cookies } from 'next/headers';
import { faker } from '@faker-js/faker';

export const COOKIES_KEY = "street-food-cookie";

export interface CookieDataInterface {
    userId: string;
    isChatPanelOpen?: boolean;
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

export async function cookiesGet(): Promise<CookieDataInterface> {
    return await getCookieData();
}

export async function cookiesSetUserId(userId: string): Promise<void> {
    const cookieData: CookieDataInterface = {
        userId: userId
    };
    (await cookies()).set(COOKIES_KEY, JSON.stringify(cookieData));
}

export async function cookiesSetChatPanel(isChatPanelOpen: boolean): Promise<void> {
    const userId = await cookiesGetUserId();
    const cookieData: CookieDataInterface = {
        userId: userId,
        isChatPanelOpen
    };
    (await cookies()).set(COOKIES_KEY, JSON.stringify(cookieData));
}