import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { headers } from "next/headers";

export const generateApi = async function(apiPath: string) {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    return `${protocol}://${host}/api/${apiPath}`;
}

export const getUserCartsApi = async function() {
    return generateApi("cart");
}

export const deleteUserCartApi = async function(userCartId: string) {
    return generateApi("cart/" + userCartId);
}

export const getCuisinesApi = async function() {
    return generateApi("cuisines");
}

export const getCuisineDetailApi = async function(cuisineId: string) {
    return generateApi(`cuisines/${cuisineId}`);
}

export const getDataFromApi = async function(api: string, cookieStore: ReadonlyRequestCookies) {
    try {
        const response = await fetch(api, {
            headers: {
                Cookie: cookieStore.toString()
            },
        });
        return await response.json();
    } catch (e) {
        console.error(`Failed to fetch ${api}`, e);
        return [];
    }
}