"use server"

import { redirect } from 'next/navigation';

import { countUserCartByUserAndFlag, deleteUserCartByUserAndUserCartId } from "../database/database";
import { cookiesSetUserIdAndTotalCart } from '../util/cookie-util';

export async function deleteCartItemAction(formData: FormData): Promise<void> {
    const userId = String(formData.get("userId"));
    const userCartId = String(formData.get("userCartId"));
    await deleteUserCartByUserAndUserCartId(userId, userCartId);

    const totalCart = await countUserCartByUserAndFlag(userId, "active");
    await cookiesSetUserIdAndTotalCart(userId, totalCart);

    redirect(`/cart`);
}