"use server"
import { redirect } from 'next/navigation';

import { deleteUserCartByUserAndUserCartId } from "../database/database";

export async function deleteCartItemAction(formData: FormData): Promise<void> {
    const userId = String(formData.get("userId"));
    const userCartId = String(formData.get("userCartId"));
    await deleteUserCartByUserAndUserCartId(userId, userCartId);
    redirect(`/dashboard/cart`);
}