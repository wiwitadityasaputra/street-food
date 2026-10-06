import { NextResponse } from "next/server";
import { deepSeek } from '@ai-sdk/deepseek';
import { generateText, isStepCount } from 'ai';
import { cookies } from "next/headers";

import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { writeToUserChatMain } from "@/src/lib/database/database";
import {
    getAddtocartInstructions,
    getAiTasksInstructions,
    getAnswerQuestionInstructions,
    getBriefInstructions,
    getCardDeletionInstructions,
    getPageNavigationInstructions
} from "@/src/lib/route/chat/instructions";
import {
    welcomeResponse
} from "@/src/lib/route/chat/responses";
import {
    getUserCartsApi,
    getCuisinesApi,
    getDataFromApi
} from "@/src/lib/route/chat/util";
import { getCuisineDetail } from "@/src/lib/route/chat/tools";
import { AiChatResponse, handleAddtocart, handleAnswerQuestion, handleDefaultAnswer, handleDeleteCart, handleDescribeTask, handleNavigation } from "@/src/lib/route/chat/handle-bot-response";

export async function POST(request: Request) {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json([]);
    }
    const cookieStore = await cookies();
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
        Input: {
            "message": *user message*
        }
        Output: {
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
            "answerQuestions": {
                "isBadQuestion": true/false,
                "response": *ai response*
            }
        }
    */

    const aiInput = JSON.stringify({ message });
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
        prompt: aiInput
    });

    const aiOutput = await result.text;
    console.log("dbg finalResponse ", aiOutput)
    const jsonResponse: AiChatResponse = JSON.parse(aiOutput);
    console.log("dbg jsonResponse ", jsonResponse)

    if (jsonResponse.navigate) {
        return handleNavigation(userId, jsonResponse.navigate, aiInput, aiOutput);
    } else if (jsonResponse.deleteCart && jsonResponse.deleteCart.userCartId) {
        return handleDeleteCart(userId, jsonResponse.deleteCart);
    } else if (jsonResponse.chatBotTask === true) {
        return handleDescribeTask(userId, aiInput, aiOutput);
    } else if (jsonResponse.answerQuestion) {
        return handleAnswerQuestion(userId, jsonResponse.answerQuestion, aiInput, aiOutput);
    } else if (jsonResponse.addToCart) {
        return handleAddtocart(userId, jsonResponse.addToCart, aiInput, aiOutput);
    } else {
        return handleDefaultAnswer(userId);
    }
}