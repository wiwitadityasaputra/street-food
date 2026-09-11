import { beforeEach, describe, expect, it, vi } from "vitest";
import { cookies } from "next/headers";
import {
    COOKIES_KEY,
    cookiesGetUserId,
    cookiesSetUserId,
    getCookieData
} from "./cookie-util";

vi.mock("next/headers", () => ({
    cookies: vi.fn()
}));

const cookiesMock = vi.mocked(cookies);

describe("cookie utilities", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns the stored cookie data", async () => {
        cookiesMock.mockResolvedValue({
            get: vi.fn().mockReturnValue({
                value: JSON.stringify({ userId: "stored-user-id" })
            })
        } as unknown as Awaited<ReturnType<typeof cookies>>);

        await expect(getCookieData()).resolves.toEqual({
            userId: "stored-user-id"
        });
    });

    it("generates a user ID when the cookie is missing", async () => {
        cookiesMock.mockResolvedValue({
            get: vi.fn().mockReturnValue(undefined)
        } as unknown as Awaited<ReturnType<typeof cookies>>);

        const cookieData = await getCookieData();

        expect(cookieData.userId).toEqual(expect.any(String));
        expect(cookieData.userId).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
    });

    it("returns the user ID from the cookie", async () => {
        cookiesMock.mockResolvedValue({
            get: vi.fn().mockReturnValue({
                value: JSON.stringify({ userId: "user-id" })
            })
        } as unknown as Awaited<ReturnType<typeof cookies>>);

        await expect(cookiesGetUserId()).resolves.toBe("user-id");
    });

    it("stores the user ID in the configured cookie", async () => {
        const set = vi.fn();
        cookiesMock.mockResolvedValue({ set } as unknown as Awaited<ReturnType<typeof cookies>>);

        await cookiesSetUserId("new-user-id");

        expect(set).toHaveBeenCalledWith(
            COOKIES_KEY,
            JSON.stringify({ userId: "new-user-id" })
        );
    });
});