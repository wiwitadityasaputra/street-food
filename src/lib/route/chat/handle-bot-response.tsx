import {
    fetchCuisineByFoodsuggestion,
    fetchUserCartIdByUseridAndCuisinename,
    writeToLlmresults,
    writeToUserChatMain
} from "../../database/database";
import {
    badQuestionResponse,
    cartNavigationRsponse,
    editCartResponse,
    menuNavigationResponse,
    multipleItemsToBeDeletedResponse,
    removeCartResponse,
    unknownFoodDescriptionResponse,
    unknownFoodResponse,
    validFoodResponse,
    welcomeResponse
} from "./responses";
import { deleteUserCartApi, getUserCartsApi } from "./util";
import { UserCartRoutePostRequest } from "@/src/app/api/cart/route";
import { cookies } from "next/headers";
import { ChatRequestStatus, ChatStreamOption, ChatStreamOptionList, ChatStreamResponse } from "./chat.definition";
import { CuisinesDbIdName } from "../../database/database.definition";
import { cartOptionsToReadable } from "../../util/utils";

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
    cuisineName: string;
    userCartId?: number;
}

export interface AnswerQuestion {
    isBad: boolean;
    response?: string;
}

export interface EditCartResponse {
    cuisineId: number;
    quantity: number;
}
export enum CuisineType {
    indonesia = "indonesia",
    western = "western",
    chinese = "chinese",
    korean = "korean"
}
export enum PriceType {
    cheap = "cheap",
    expensive = "expensive"
}
export enum HighLowType {
    lowest = "lowest",
    highest = "highest"
}
export interface FoodSuggestion {
    country?: CuisineType;
    price?: PriceType;
    rate?: HighLowType;
    sales?: HighLowType;
}

export interface AiChatResponse {
    editCart?: EditCartResponse;
    addToCart?: AddToCartResponse;
    deleteCart?: DeleteCartResponse;
    navigate?: NavigateResponse;
    chatBotTask?: boolean;
    answerQuestion?: AnswerQuestion;
    foodSuggestion?: FoodSuggestion;
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
        await writeToUserChatMain(userId, "assistant", "standard", responseMsg);
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
        await writeToUserChatMain(userId, "assistant", "standard", reply);
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
        await writeToUserChatMain(userId, "assistant", "standard", reply);
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

export const handleDeleteCart = async (userId: string, deleteCart: DeleteCartResponse, aiInput: string, aiOutput: string): Promise<ChatStreamResponse> => {
    const cuisineName  = deleteCart.cuisineName;
    const carts = await fetchUserCartIdByUseridAndCuisinename(userId, cuisineName);
    if (deleteCart.userCartId || carts.length === 1) {
        try {
            const userCartId = deleteCart.userCartId || carts[0].userCartId;
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
            await writeToUserChatMain(userId, "assistant", "standard", responseMsg);
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
    } else if (carts.length > 1) {
        const m = multipleItemsToBeDeletedResponse(deleteCart.cuisineName);
        await writeToUserChatMain(userId, "assistant", "standard", m);

        const options: ChatStreamOptionList[] = [];
        const replies = [ m ];
        for (const [index, c] of carts.entries()) {
            const message = cartOptionsToReadable(index + 1, deleteCart.cuisineName, c.finalPrice, c.options);
            options.push({
                label: message,
                value: `Remove from cart: ${message}`
            })
            replies.push(message);
        }
        writeToLlmresults(aiInput, aiOutput);
        return {
            status: ChatRequestStatus.DONE,
            action: "CART",
            option: {
                message: m,
                options: options
            }
        };
    } else {
        return handleDefaultAnswer(userId);
    }
}

export const handleNavigation = async (userId: string, navigate: NavigateResponse, aiInput: string, aiOutput: string): Promise<ChatStreamResponse> => {
    const toPage = navigate.toPage;
    writeToLlmresults(aiInput, aiOutput);

    if (toPage === "menu") {
        const responseMsg = menuNavigationResponse();
        await writeToUserChatMain(userId, "assistant", "standard", responseMsg);
        return {
            status: ChatRequestStatus.DONE,
            replies: [responseMsg],
            action: "MENU"
        };
    } else {
        const responseMsg = cartNavigationRsponse();
        await writeToUserChatMain(userId, "assistant", "standard", responseMsg);
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
    for (const r of responses) {
        await writeToUserChatMain(userId, "assistant", "standard", r);
    }
    writeToLlmresults(aiInput, aiOutput);

    return {
        status: ChatRequestStatus.DONE,
        action: "AI_TASKS",
        replies: responses
    };
}

export const handleAnswerQuestion = async (userId: string, answerQuestion: AnswerQuestion, aiInput: string, aiOutput: string): Promise<ChatStreamResponse> => {
    const isBad = answerQuestion.isBad;
    const response = answerQuestion.response;
    writeToLlmresults(aiInput, aiOutput);
    if (!isBad && response) {
        await writeToUserChatMain(userId, "assistant", "standard", response);
        return {
            status: ChatRequestStatus.DONE,
            replies: [response]
        };
    } else {
        return handleDefaultAnswer(userId);
    }
}

export const handleFoodSuggestion = async (userId: string, foodSuggestion: FoodSuggestion, aiInput: string, aiOutput: string): Promise<ChatStreamResponse> => {
    writeToLlmresults(aiInput, aiOutput);

    const dbResults: CuisinesDbIdName[] = await fetchCuisineByFoodsuggestion(foodSuggestion);
    if (dbResults.length == 0) {
        const reply = unknownFoodDescriptionResponse();
        await writeToUserChatMain(userId, "assistant", "standard", reply);
        return {
            status: ChatRequestStatus.DONE,
            replies: [reply]
        };
    } else {
        const replies = dbResults.map(d => d.cuisinename).join(", ");
        await writeToUserChatMain(userId, "assistant", "standard", replies);
        return {
            status: ChatRequestStatus.DONE,
            replies: [replies]
        };
    }
}

export const handleDefaultAnswer = async (userId: string): Promise<ChatStreamResponse> => {
    const badQuestResponse = badQuestionResponse();
    await writeToUserChatMain(userId, "assistant", "standard", badQuestResponse);

    const responseMsg = welcomeResponse();
    await writeToUserChatMain(userId, "assistant", "standard", responseMsg);

    return {
        status: ChatRequestStatus.DONE,
        replies: [badQuestResponse, responseMsg]
    };
}