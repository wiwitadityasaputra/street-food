import { NextResponse } from "next/server";
import { deepSeek } from '@ai-sdk/deepseek';
import { generateText, isStepCount } from 'ai';
import { cookies,headers } from "next/headers";

import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { writeToUserChatMain } from "@/src/lib/database/database";
import { UserCartRoutePostRequest } from "../cart/route";
import {
    getAddtocartInstructions,
    getAiTasksInstructions,
    getAnswerQuestionInstructions,
    getBriefInstructions,
    getCardDeletionInstructions,
    getPageNavigationInstructions
} from "@/src/lib/route/chat/instructions";
import {
    cartNavigationRsponse,
    menuNavigationResponse,
    removeCartResponse,
    welcomeResponse,
    badQuestionResponse,
    unknownFoodResponse,
    validFoodResponse
} from "@/src/lib/route/chat/responses";
import {
    getUserCartsApi,
    deleteUserCartApi,
    getCuisinesApi,
    getDataFromApi
} from "@/src/lib/route/chat/util";
import { getCuisineDetail } from "@/src/lib/route/chat/tools";

export async function POST(request: Request) {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json([]);
    }
    const cookieStore = await cookies();
    const headersList = await headers();
    const referrer = headersList.get('referer');
    if (!referrer) {
        return NextResponse.json([]);
    }
    const url = new URL(referrer);
    const segments = url.pathname.split('/').filter(Boolean);
    const page = segments.pop();

    const { message } = await request.json();
    if (!message || message.length > 100) {
        const responseMsg = welcomeResponse();
        await writeToUserChatMain(userId, responseMsg, "assistant");

        return NextResponse.json({
            replies: [responseMsg]
        });
    }
    await writeToUserChatMain(userId, message, "user");

    const userCartsApi = await getUserCartsApi();
    const cartData = await getDataFromApi(userCartsApi, cookieStore);

    const cuisineApi = await getCuisinesApi();
    const cuisines = await getDataFromApi(cuisineApi, cookieStore);

    /*
        {
            "input": {
                "message": *user message*,
                "page": "cart" // "menu" | "cart"
            },
            "output": {
                "addToCart": {
                    "cuisineName": *cuisineName*,
                    "isValid": true/false

                    "cuisineId": *cuisineId*,
                    "quantity": *quantity*
                    "addOns": [1,3,3]
                },
                "navigate": {
                    "toPage": "cart" // "menu" | "cart"
                },
                "deleteCart": {
                    "userCartId": 31
                },
                "chatBotTask": true/false,
                "answeringQuestions": {
                    "isBadQuestion": true/false,
                    "response": *ai response*
                }
            }
        }
    */

    const result = await generateText({
        model: deepSeek('deepseek-v4-pro'),
        instructions: `
            ${getBriefInstructions()}

            ${getAddtocartInstructions(1, cuisines)}

            ${getPageNavigationInstructions(2)}

            ${getCardDeletionInstructions(3, cartData)}

            ${getAiTasksInstructions(4)}

            ${getAnswerQuestionInstructions(5)}
        `,
        tools: {
            getCuisineDetail: getCuisineDetail(cookieStore)
        },
        stopWhen: isStepCount(5),
        prompt: JSON.stringify({ message, page })
    });

    const finalResponse = await result.text;
    console.log("dbg finalResponse ", finalResponse)
    const jsonResponse = JSON.parse(finalResponse);
    console.log("dbg jsonResponse ", jsonResponse)

    if (jsonResponse.navigate) {
        const toPage = jsonResponse.navigate.toPage;

        if (toPage === "menu") {
            const responseMsg = menuNavigationResponse();
            await writeToUserChatMain(userId, responseMsg, "assistant", finalResponse);
            return NextResponse.json({
                replies: [responseMsg],
                action: "MENU"
            });
        } else {
            const responseMsg = cartNavigationRsponse();
            await writeToUserChatMain(userId, responseMsg, "assistant", finalResponse);
            return NextResponse.json({
                replies: [responseMsg],
                action: "CART"
            });
        }
    } else if (jsonResponse.deleteCart && jsonResponse.deleteCart.userCartId) {
        const userCartId  = jsonResponse.deleteCart.userCartId;
        try {

            const deleteUrl = await deleteUserCartApi(userCartId);
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
    } else if (jsonResponse.chatBotTask === true) {
        const responses = [
            "Hi i able to do following task",
            "1. Move between menu & cart page only.",
            "2. Delete food from your cart.",
            "3. Adding food to your cart.",
            "4. Asking your random questions.",
        ];
        responses.forEach(r => {
            writeToUserChatMain(userId, r, "assistant", finalResponse);
        })
        return NextResponse.json({
            action: "AI_TASKS",
            replies: responses
        });
    } else if (jsonResponse.answerQuestion) {
        const answerQuestion = jsonResponse.answerQuestion;
        const isBad = answerQuestion.isBad;
        const response = answerQuestion.response;
        if (!isBad && response) {
            await writeToUserChatMain(userId, response, "assistant");
            return NextResponse.json({
                replies: [response]
            });
        } else {
            const badQuestResponse = badQuestionResponse();
            await writeToUserChatMain(userId, badQuestResponse, "assistant");

            const responseMsg = welcomeResponse();
            await writeToUserChatMain(userId, responseMsg, "assistant");

            return NextResponse.json({
                replies: [badQuestResponse, responseMsg]
            });
        }
    } else if (jsonResponse.addToCart) {
        const addToCart = jsonResponse.addToCart;
        const isValid = addToCart.isValid;
        const cuisineName = addToCart.cuisineName;

        if (!isValid) {
            const reply = unknownFoodResponse(cuisineName);
            await writeToUserChatMain(userId, reply, "assistant", finalResponse);
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
            await writeToUserChatMain(userId, reply, "assistant", finalResponse);

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

    } else {
        const badQuestResponse = badQuestionResponse();
        await writeToUserChatMain(userId, badQuestResponse, "assistant");

        const responseMsg = welcomeResponse();
        await writeToUserChatMain(userId, responseMsg, "assistant");

        return NextResponse.json({
            replies: [badQuestResponse, responseMsg]
        });
    }
}