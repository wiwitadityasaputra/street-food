import { tool } from 'ai';
import { z } from 'zod';

import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { UserCartRouteGetResponse } from "@/src/app/api/cart/route";
import { CuisineDetailGetResponse } from "@/src/app/api/cuisines/[id]/route";
import { getCuisineDetailApi, getCuisinesApi, getUserCartsApi } from "@/src/lib/route/chat/v1/util";
import logger from '@/src/lib/util/logger';

export const getCuisineDetail = (cookieStore: ReadonlyRequestCookies) => tool({
    inputSchema: z.object({
        cuisineId: z.number()
    }),
    execute: async ({
        cuisineId
    }): Promise<any> => {
        const url = await getCuisineDetailApi(String(cuisineId));
        try {
            const response = await fetch(url, {
                headers: {
                    Cookie: cookieStore.toString()
                },
            });
            const result: CuisineDetailGetResponse = await response.json();
            return result;
        } catch (e) {
            logger.error({e}, "tools - getCuisineDetail - failed fetch");
            return {};
        }
    }
});

export const getUserCart = (cookieStore: ReadonlyRequestCookies) => tool({
    inputSchema: z.object({}),
    execute: async (): Promise<any> => {
        const url = await getUserCartsApi();
        try {
            const response = await fetch(url, {
                headers: {
                    Cookie: cookieStore.toString()
                },
            });
            const result: UserCartRouteGetResponse[] = await response.json();
            return result;
        } catch (e) {
            logger.error({e}, "tools - getUserCart - failed fetch");
            return {};
        }
    }
});

export const getCuisines = (cookieStore: ReadonlyRequestCookies) => tool({
    inputSchema: z.object({}),
    execute: async (): Promise<any> => {
        const url = await getCuisinesApi();
        try {
            const response = await fetch(url, {
                headers: {
                    Cookie: cookieStore.toString()
                },
            });
            const result: CuisineDetailGetResponse = await response.json();
            return result;
        } catch (e) {
            logger.error({e}, "tools - getCuisines - failed fetch");
            return {};
        }
    }
});