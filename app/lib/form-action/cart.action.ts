"use server"

import { redirect } from 'next/navigation';

import {
    countUserCartByUserAndFlag,
    deleteUserCartByUserAndUserCartId
} from "@/app/lib/database/database";
import {
    cookiesSetUserIdAndTotalCart
} from '@/app/lib/util/cookie-util';
import { UserCartDbFlag } from '../database/database.definition';
import { DEFAULT_SUCCESS_MESSAGE, ProcessCartActionResponse } from './form-action.definition';

export async function deleteCartItemAction(formData: FormData): Promise<void> {
    const userId = String(formData.get("userId"));
    const userCartId = String(formData.get("userCartId"));
    await deleteUserCartByUserAndUserCartId(userId, userCartId);

    const totalCart = await countUserCartByUserAndFlag(userId, UserCartDbFlag.ACTIVE);
    await cookiesSetUserIdAndTotalCart(userId, totalCart);

    redirect(`/cart`);
}

export async function processCarts(prevState: any, formData: FormData): Promise<ProcessCartActionResponse> {
    console.log("dbg formData ", formData)
    try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {
        return {
            erroMessage: String(error)
        }
    }
    
    
    return {
        successMessage: DEFAULT_SUCCESS_MESSAGE
    }
}