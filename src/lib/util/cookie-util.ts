import { cookies } from 'next/headers';
import { faker } from '@faker-js/faker';
import { welcomeResponse } from '@/src/lib/route/chat/v1/responses';
import { ChatVersion } from './app-contex';

export const COOKIES_KEY = "street-food-cookie";

export interface CookieDataInterface {
    userId: string;
    isChatPanelOpen?: boolean;
    welcomeMessage: string;
    chatVersion?: ChatVersion;
}

export async function getCookieData(): Promise<CookieDataInterface> {
    const userCookies = (await cookies()).get(COOKIES_KEY);
    if (userCookies && userCookies.value) {
        const str = userCookies.value;
        const cookieData: CookieDataInterface = JSON.parse(str);
        return cookieData;
    }
    return {
        userId: faker.string.uuid(),
        welcomeMessage: welcomeResponse(),
        chatVersion: "v2"
    };
}

export async function cookiesGetUserId(): Promise<string> {
    const cookieData = await getCookieData();
    return cookieData.userId;
}

export async function cookiesSetChatPanel(isChatPanelOpen: boolean): Promise<void> {
    const cookieData = await getCookieData();
    cookieData.isChatPanelOpen = isChatPanelOpen;
    (await cookies()).set(COOKIES_KEY, JSON.stringify(cookieData));
}

export async function cookiesSetChatversion(chatVersion: ChatVersion): Promise<void> {
    const cookieData = await getCookieData();
    cookieData.chatVersion = chatVersion;
    (await cookies()).set(COOKIES_KEY, JSON.stringify(cookieData));
}