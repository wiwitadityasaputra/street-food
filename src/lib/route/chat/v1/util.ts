import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { headers } from "next/headers";
import { GoogleGenAI } from "@google/genai";
import logger from "@/src/lib/util/logger";

const googleAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export async function generateEmbedding(
    text: string
): Promise<number[]> {
    const response = await googleAI.models.embedContent({
        model: "gemini-embedding-2",
        contents: text,
        config: {
            outputDimensionality: 1536,
        },
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding || embedding.length !== 1536) {
        throw new Error("Failed to generate a 1536-dimensional embedding");
    }

    return embedding;
}

export const generateApi = async function(apiPath: string) {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    return `${protocol}://${host}/api/${apiPath}`;
}

export const getUserCartsApi = async function() {
    return generateApi("cart");
}

export const deleteUserCartApi = async function(userCartId: number) {
    return generateApi("cart/" + userCartId);
}

export const editUserCartApi = async function(userCartId: number) {
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
        logger.error({e}, "utils - getDataFromApi - failed fetch");
        return [];
    }
}