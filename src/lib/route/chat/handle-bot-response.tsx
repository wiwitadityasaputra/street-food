import { NextResponse } from "next/server";
import { writeToUserChatMain } from "../../database/database";
import {
    badQuestionResponse,
    cartNavigationRsponse,
    menuNavigationResponse,
    removeCartResponse,
    unknownFoodResponse,
    validFoodResponse,
    welcomeResponse
} from "./responses";
import { deleteUserCartApi, getUserCartsApi } from "./util";
import { UserCartRoutePostRequest } from "@/src/app/api/cart/route";
import { cookies } from "next/headers";

export interface AddToCartResponse {
    cuisineName: string;
    isValid: boolean;
    cuisineId?: number;
    quantity?: number;
    addOnsIds?: number[];
}

export interface NavigateResponse {
    toPage: "cart" | "menu";
}

export interface DeleteCartResponse {
    userCartId: number;
}

export interface AnswerQuestion {
    isBad: boolean;
    response?: string;
}

export interface AiChatResponse {
    addToCart?: AddToCartResponse;
    navigate?: NavigateResponse;
    deleteCart?: DeleteCartResponse;
    chatBotTask?: boolean;
    answerQuestion?: AnswerQuestion;
}

export const handleNavigation = async (userId: string, navigate: NavigateResponse, aiInput: string, aiOutput: string) => {
    const toPage = navigate.toPage;

    if (toPage === "menu") {
        const responseMsg = menuNavigationResponse();
        await writeToUserChatMain(userId, responseMsg, "assistant", aiInput, aiOutput);
        return NextResponse.json({
            replies: [responseMsg],
            action: "MENU"
        });
    } else {
        const responseMsg = cartNavigationRsponse();
        await writeToUserChatMain(userId, responseMsg, "assistant", aiInput, aiOutput);
        return NextResponse.json({
            replies: [responseMsg],
            action: "CART"
        });
    }
}

export const handleDeleteCart = async (userId: string, deleteCart: DeleteCartResponse) => {
    const userCartId  = deleteCart.userCartId;
    try {

        const deleteUrl = await deleteUserCartApi(userCartId);
        const cookieStore = await cookies();
        const deleteResponse = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                Cookie: cookieStore.toString()
            },
        });
        const bodyResponse = await deleteResponse.json();
        const totalCart = bodyResponse.totalCart;

        const responseMsg = removeCartResponse();
        await writeToUserChatMain(userId, responseMsg, "assistant");
        return NextResponse.json({
            replies: [responseMsg],
            action: "CART",
            totalCart
        });
    } catch (e) {
        console.error("error ", e)
        const responseMsg = welcomeResponse();
        return NextResponse.json({
            replies: [responseMsg]
        });
    }
}

export const handleDescribeTask = async (userId: string, aiInput: string, aiOutput: string) => {
    const responses = [
        "Hi i able to do following task",
        "1. Move between menu & cart page only.",
        "2. Delete food from your cart.",
        "3. Adding food to your cart.",
        "4. Asking your random questions.",
    ];
    responses.forEach(r => {
        writeToUserChatMain(userId, r, "assistant", aiInput, aiOutput);
    })
    return NextResponse.json({
        action: "AI_TASKS",
        replies: responses
    });
}

export const handleAnswerQuestion = async (userId: string, answerQuestion: AnswerQuestion, aiInput: string, aiOutput: string) => {
    const isBad = answerQuestion.isBad;
    const response = answerQuestion.response;
    if (!isBad && response) {
        await writeToUserChatMain(userId, response, "assistant", aiInput, aiOutput);
        return NextResponse.json({
            replies: [response]
        });
    } else {
        return handleDefaultAnswer(userId);
    }
}

export const handleDefaultAnswer = async (userId: string) => {
    const badQuestResponse = badQuestionResponse();
    await writeToUserChatMain(userId, badQuestResponse, "assistant");

    const responseMsg = welcomeResponse();
    await writeToUserChatMain(userId, responseMsg, "assistant");

    return NextResponse.json({
        replies: [badQuestResponse, responseMsg]
    }); 
}

export const handleAddtocart = async (userId: string, addToCart: AddToCartResponse, aiInput: string, aiOutput: string) => {
    const isValid = addToCart.isValid;
    const cuisineName = addToCart.cuisineName;

    if (!isValid) {
        const reply = unknownFoodResponse(cuisineName);
        await writeToUserChatMain(userId, reply, "assistant", aiInput);
        return NextResponse.json({
            replies: [reply]
        });
    } else {
        const cuisineId = addToCart.cuisineId;
        const quantity = addToCart.quantity;
        const addOnsIds = addToCart.addOnsIds;

        const postBody: UserCartRoutePostRequest = {
            cuisineId: cuisineId,
            quantity: quantity,
            addOnsIds: addOnsIds
        };

        const reply = validFoodResponse(cuisineName);
        await writeToUserChatMain(userId, reply, "assistant", aiInput, aiOutput);
        const userCartsApi = await getUserCartsApi();
        const cookieStore = await cookies();

        let totalCart = 0;
        try {
            const response = await fetch(userCartsApi, {
                method: 'POST',
                headers: {
                    Cookie: cookieStore.toString(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postBody)
            });
            const bodyResponse = await response.json();
            totalCart = bodyResponse.totalCart;
        } catch (e) {
            console.error(`Failed to post new cart data `, e);
        }

        return NextResponse.json({
            replies: [reply],
            action: "CART",
            totalCart
        });
    }
}