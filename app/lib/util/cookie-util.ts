import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export const COOKIES_KEY = "street-food-cookie";

export interface CookieDataInterface {
    userId?: string;
    totalCart?: number;
}

export async function getCookieData(): Promise<CookieDataInterface> {
    const userCookies = (await cookies()).get(COOKIES_KEY);
    if (userCookies && userCookies.value) {
        const str = userCookies.value;
        const cookieData: CookieDataInterface = JSON.parse(str);
        return cookieData;
    }
    return {};
}

export async function cookiesGetUserId(): Promise<string> {
    const cookieData = await getCookieData();
    if (cookieData && cookieData.userId) {
        return cookieData.userId;
    }
    return uuidv4();
}

export async function cookisGetTotalCart(): Promise<number> {
    const cookieData = await getCookieData();
    if (cookieData && cookieData.totalCart) {
        return cookieData.totalCart;
    }
    return 0;
}

export async function cookiesSetUserIdAndTotalCart(userId: string, totalCart: number): Promise<void> {
    const cookieData = await getCookieData();
    cookieData.userId = userId;
    cookieData.totalCart = totalCart;
    (await cookies()).set(COOKIES_KEY, JSON.stringify(cookieData));
}