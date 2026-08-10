"use server"

import {
    countUserCartByUserAndFlag,
    deleteUserCartByUserAndUserCartId,
    fetchUserCartIdByUserAndFlag,
    updateUserCartFlagIsCooking,
    writeToOrder
} from "@/src/lib/database/database";
import {
    OrderDbFlag,
    UserCartDbFlag
} from '@/src/lib/database/database.definition';
import {
    DEFAULT_SUCCESS_MESSAGE,
    DeleteCartActionResponse,
    ProcessCartActionResponse
} from "@/src/lib/form-action/form-action.definition";

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
        const firstName = String(formData.get("firstName"));
        const lastName = String(formData.get("lastName"));
        const streetAddress = String(formData.get("streetAddress"));
        const secondAddress = String(formData.get("secondAddress"));
        const city = String(formData.get("city"));
        const state = String(formData.get("state"));
        const zipCode = String(formData.get("zipCode"));
        const phoneNumber = String(formData.get("phoneNumber"));
        const emailAddress = String(formData.get("emailAddress"));
        const additionalInfo = String(formData.get("additionalInfo"));

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
        const newOrderId = await writeToOrder(OrderDbFlag.CREATED, firstName, lastName, streetAddress, secondAddress, city, state, zipCode, phoneNumber, emailAddress, additionalInfo)

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
