import { tool } from 'ai';
import { z } from 'zod';

import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

import { CuisineDetailGetResponse } from "@/src/app/api/cuisines/[id]/route";
import { getCuisineDetailApi } from "@/src/lib/route/chat/util";

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
            console.error(`Failed to fetch ${url}`, e);
            return {};
        }
    }
});