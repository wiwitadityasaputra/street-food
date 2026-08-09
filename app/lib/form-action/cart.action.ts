"use server"

import { redirect } from 'next/navigation';

import {
    countUserCartByUserAndFlag,
    deleteUserCartByUserAndUserCartId,
    fetchUserCartIdByUserAndFlag,
    updateUserCartFlagIsCooking,
    writeToOrder
} from "@/app/lib/database/database";
import { OrderDbFlag, UserCartDbFlag } from '../database/database.definition';
import { DEFAULT_SUCCESS_MESSAGE, DeleteCartActionResponse, ProcessCartActionResponse } from './form-action.definition';

export async function deleteCartItemAction(prevState: any, formData: FormData): Promise<DeleteCartActionResponse> {
    const userId = String(formData.get("userId"));
    const userCartId = String(formData.get("userCartId"));
    await deleteUserCartByUserAndUserCartId(userId, userCartId);
    const totalCart = await countUserCartByUserAndFlag(userId, UserCartDbFlag.ACTIVE);

    return {
        successMessage: DEFAULT_SUCCESS_MESSAGE,
        successObject: {
            totalCart: totalCart
        }
    }
}

export async function processCarts(prevState: any, formData: FormData): Promise<ProcessCartActionResponse> {
    try {
        const userId = String(formData.get("userId"));

        // get all user_cart_id by user & flag=active
        const userCartIds = await fetchUserCartIdByUserAndFlag(userId, UserCartDbFlag.ACTIVE);

        // convert ids to match WHERE statement, ex [{usercartid:30}, {usercartid:30}] -> (30,31)
        let userCartIdsStr = "(";
        userCartIds.forEach((u, index) => {
            if (index > 0) {
                userCartIdsStr += ", ";
            }
            userCartIdsStr += u.usercartid;
        })
        userCartIdsStr += ")";

        // create new order
        const newOrderId = await writeToOrder(OrderDbFlag.CREATED)

        // update user_cart_id set flag=cooking and with new order
        const sqlString = `UPDATE user_cart 
            SET flag = ${UserCartDbFlag.COOKING}, user_order_id=${newOrderId} 
            WHERE user_cart_id in ${userCartIdsStr};`;
        await updateUserCartFlagIsCooking(sqlString);

        // update cookie, set cart to 0
        // dev-note by adding "await", somehow it will refresh the page 
        // cookiesSetUserId(userId);
    } catch (error) {
        return {
            erroMessage: String(error)
        }
    }

    return {
        successMessage: DEFAULT_SUCCESS_MESSAGE
    }
}
