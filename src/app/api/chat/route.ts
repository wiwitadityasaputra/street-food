import { NextResponse } from "next/server";
import { deepSeek } from '@ai-sdk/deepseek';
import { generateText, isStepCount } from 'ai';
import { cookies } from "next/headers";

import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { findAioutputOnUserchatmainByEmbedding, writeToUserChatMain } from "@/src/lib/database/database";
import {
    getAddtocartInstructions,
    getAiTasksInstructions,
    getAnswerQuestionInstructions,
    getBriefInstructions,
    getCardDeletionInstructions,
    getFoodSuggestion,
    getPageNavigationInstructions
} from "@/src/lib/route/chat/instructions";
import {
    welcomeResponse
} from "@/src/lib/route/chat/responses";
import {
    getUserCartsApi,
    getCuisinesApi,
    getDataFromApi,
    generateEmbedding
} from "@/src/lib/route/chat/util";
import { getCuisineDetail } from "@/src/lib/route/chat/tools";
import {
    AiChatResponse,
    handleAddtocart,
    handleAnswerQuestion,
    handleDefaultAnswer,
    handleDeleteCart,
    handleDescribeTask,
    handleFoodSuggestion,
    handleNavigation
} from "@/src/lib/route/chat/handle-bot-response";

export async function POST(request: Request) {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json([]);
    }
    const cookieStore = await cookies();
    const { message } = await request.json();
    if (!message || message.length > 200) {
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
    console.log("dbg aiInput ", aiInput)

    // 1. Call Gemini Embeddings API
    const embedding = await generateEmbedding(aiInput);
    // 2. Search PostgreSQL using pgvector
    const cachedAnswer = await findAioutputOnUserchatmainByEmbedding(embedding);

    let aiOutput = "";
    if (cachedAnswer && cachedAnswer.similarity >= 0.90) {
        console.log("dbg cachedAnswer.similarity ", cachedAnswer.similarity)
        // 3. If a suitable answer exists, reuse it
        aiOutput = cachedAnswer.aioutput;
    } else {
        console.log("dbg call llm api ")
        // 4. Otherwise, call your LLM
        const result = await generateText({
            model: deepSeek('deepseek-v4-pro'),
            instructions: `
                ${getBriefInstructions(cuisines)}

                ${getAddtocartInstructions(1)}

                ${getPageNavigationInstructions(2)}

                ${getCardDeletionInstructions(3, cartData)}

                ${getAiTasksInstructions(4)}

                ${getFoodSuggestion(5)}

                ${getAnswerQuestionInstructions(6)}
            `,
            tools: {
                getCuisineDetail: getCuisineDetail(cookieStore)
            },
            stopWhen: isStepCount(5),
            prompt: aiInput
        });
        aiOutput = await result.text;
    }

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
    } else if (jsonResponse.foodSuggestion) {
        return handleFoodSuggestion(userId, jsonResponse.foodSuggestion, aiInput, aiOutput);
    } else {
        return handleDefaultAnswer(userId);
    }
}