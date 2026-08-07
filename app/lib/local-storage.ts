"use client";

import { AddtoCartActionSuccessObject } from "./definition";

export interface UserSession {
    userId?: string;
    items?: AddtoCartActionSuccessObject[];
}

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const STORAGE_KEY_USER = "street-food-user";

export function getUser(): UserSession {
    if (typeof window !== "undefined") {
        let userString = localStorage.getItem(STORAGE_KEY_USER);
        if (!userString) {
            const newUser: UserSession = {
                userId: String(getRandomInt(1, 100))
            };
            userString = JSON.stringify(newUser);
            localStorage.setItem(STORAGE_KEY_USER, userString);
        }

        return JSON.parse(userString);
    } else {
        return {};
    }
}

function saveUser(user: UserSession) {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
}

export function getCartItems(): AddtoCartActionSuccessObject[] {
    const items = getUser().items;
    if (items && items.length) {
        return items;
    }
    return [];
}

export function addToCart(data: AddtoCartActionSuccessObject) {
    const user = getUser();
    if (!user.items) {
        user.items = [];
    }
    user.items.push(data);
    saveUser(user);
}