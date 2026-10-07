import { writeToUserChatMain } from "../../database/database";
import {
    badQuestionResponse,
    cartNavigationRsponse,
    editCartResponse,
    menuNavigationResponse,
    removeCartResponse,
    unknownFoodDescriptionResponse,
    unknownFoodResponse,
    validFoodResponse,
    welcomeResponse
} from "./responses";
import { deleteUserCartApi, getUserCartsApi } from "./util";
import { UserCartRoutePostRequest } from "@/src/app/api/cart/route";
import { cookies } from "next/headers";
import { ChatStreamResponse } from "@/src/app/api/chat/route";
import { ChatRequestStatus } from "./chat.definition";

export interface AddToCartResponse {
    cuisineName: string;
    isValid: boolean;
    cuisineId?: number;
    quantity?: number;
    addOnsIds?: number[];
}

export interface NavigateResponse {
    toPage: "cart" | "menu" ;
}

export interface DeleteCartResponse {
    cuisineId: number;
}

export interface AnswerQuestion {
    isBad: boolean;
    response?: string;
}

export interface EditCartResponse {
    cuisineId: number;
    quantity: number;
}

export interface AiChatResponse {
    editCart?: EditCartResponse;
    addToCart?: AddToCartResponse;
    deleteCart?: DeleteCartResponse;
    navigate?: NavigateResponse;
    chatBotTask?: boolean;
    answerQuestion?: AnswerQuestion;
    foodSuggestion?: string[];
}

export const handleEditCart = async (userId: string, editCart: EditCartResponse): Promise<ChatStreamResponse> => {
    try {
        const cuisineId = editCart.cuisineId
        const editUrl = await deleteUserCartApi(cuisineId);
        const cookieStore = await cookies();
        const editResponse = await fetch(editUrl, {
            method: 'PUT',
            headers: {
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(editCart)
        });
        await editResponse.json();
        const responseMsg = editCartResponse();
        await writeToUserChatMain(userId, responseMsg, "assistant");
        return {
            status: ChatRequestStatus.DONE,
            replies: [responseMsg],
            action: "CART"
        };
    } catch (e) {
        console.error("error edit cart", e)
        const responseMsg = welcomeResponse();
        return {
            status: ChatRequestStatus.DONE,
            replies: [responseMsg]
        };
    }
}

export const handleAddtocart = async (userId: string, addToCart: AddToCartResponse, aiInput: string, aiOutput: string): Promise<ChatStreamResponse> => {
    const isValid = addToCart.isValid;
    const cuisineName = addToCart.cuisineName;

    if (!isValid) {
        const reply = unknownFoodResponse(cuisineName);
        await writeToUserChatMain(userId, reply, "assistant", aiInput);
        return {
            status: ChatRequestStatus.DONE,
            replies: [reply]
        };
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

        return {
            status: ChatRequestStatus.DONE,
            replies: [reply],
            action: "CART",
            totalCart
        };
    }
}

export const handleDeleteCart = async (userId: string, deleteCart: DeleteCartResponse): Promise<ChatStreamResponse> => {
    const cuisineId  = deleteCart.cuisineId;
    try {
        const deleteUrl = await deleteUserCartApi(cuisineId);
        const cookieStore = await cookies();
        const deleteResponse = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                Cookie: cookieStore.toString()
            },
        });
        const bodyResponse = await deleteResponse.json();
        const totalCart = bodyResponse.totalCart;

        console.log("dbg totalCart ", totalCart)

        const responseMsg = removeCartResponse();
        await writeToUserChatMain(userId, responseMsg, "assistant");
        return {
            status: ChatRequestStatus.DONE,
            replies: [responseMsg],
            action: "CART",
            totalCart
        };
    } catch (e) {
        console.error("error ", e)
        const responseMsg = welcomeResponse();
        return {
            status: ChatRequestStatus.DONE,
            replies: [responseMsg]
        };
    }
}

export const handleNavigation = async (userId: string, navigate: NavigateResponse, aiInput: string, aiOutput: string): Promise<ChatStreamResponse> => {
    const toPage = navigate.toPage;

    if (toPage === "menu") {
        const responseMsg = menuNavigationResponse();
        await writeToUserChatMain(userId, responseMsg, "assistant", aiInput, aiOutput);
        return {
            status: ChatRequestStatus.DONE,
            replies: [responseMsg],
            action: "MENU"
        };
    } else {
        const responseMsg = cartNavigationRsponse();
        await writeToUserChatMain(userId, responseMsg, "assistant", aiInput, aiOutput);
        return {
            status: ChatRequestStatus.DONE,
            replies: [responseMsg],
            action: "CART"
        };
    }
}

export const handleDescribeTask = async (userId: string, aiInput: string, aiOutput: string): Promise<ChatStreamResponse> => {
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
    return {
        status: ChatRequestStatus.DONE,
        action: "AI_TASKS",
        replies: responses
    };
}

export const handleAnswerQuestion = async (userId: string, answerQuestion: AnswerQuestion, aiInput: string, aiOutput: string): Promise<ChatStreamResponse> => {
    const isBad = answerQuestion.isBad;
    const response = answerQuestion.response;
    if (!isBad && response) {
        await writeToUserChatMain(userId, response, "assistant", aiInput, aiOutput);
        return {
            status: ChatRequestStatus.DONE,
            replies: [response]
        };
    } else {
        return handleDefaultAnswer(userId);
    }
}

export const handleFoodSuggestion = async (userId: string, foodSuggestion: string[], aiInput: string, aiOutput: string): Promise<ChatStreamResponse> => {
    if (foodSuggestion.length == 0) {
        const reply = unknownFoodDescriptionResponse();
        await writeToUserChatMain(userId, reply, "assistant", aiInput, aiOutput);
        return {
            status: ChatRequestStatus.DONE,
            replies: [reply]
        };
    } else {
        const reply = foodSuggestion.join(", ");
        await writeToUserChatMain(userId, reply, "assistant", aiInput, aiOutput);
        return {
            status: ChatRequestStatus.DONE,
            replies: [reply]
        };
    }
}

export const handleDefaultAnswer = async (userId: string): Promise<ChatStreamResponse> => {
    const badQuestResponse = badQuestionResponse();
    await writeToUserChatMain(userId, badQuestResponse, "assistant");

    const responseMsg = welcomeResponse();
    await writeToUserChatMain(userId, responseMsg, "assistant");

    return {
        status: ChatRequestStatus.DONE,
        replies: [badQuestResponse, responseMsg]
    };
}