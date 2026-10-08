import { NextResponse } from "next/server";
import { deepSeek } from '@ai-sdk/deepseek';
import { generateText, isStepCount } from 'ai';
import { cookies } from "next/headers";

import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { findSimilarityOnLlmresultsByEmbedding, writeToUserChatMain } from "@/src/lib/database/database";
import {
    getAddtocartInstructions,
    getAiTasksInstructions,
    getAnswerQuestionInstructions,
    getBriefInstructions,
    getCardDeletionInstructions,
    getEditCartInstructions,
    getFoodSuggestion,
    getPageNavigationInstructions
} from "@/src/lib/route/chat/instructions";
import {
    welcomeResponse
} from "@/src/lib/route/chat/responses";
import {
    generateEmbedding
} from "@/src/lib/route/chat/util";
import { getCuisineDetail, getCuisines, getUserCart } from "@/src/lib/route/chat/tools";
import {
    AiChatResponse,
    handleAddtocart,
    handleAnswerQuestion,
    handleDefaultAnswer,
    handleDeleteCart,
    handleDescribeTask,
    handleEditCart,
    handleFoodSuggestion,
    handleNavigation
} from "@/src/lib/route/chat/handle-bot-response";
import {
    ChatRequestStatus,
    ChatStreamResponse
} from "@/src/lib/route/chat/chat.definition";

export async function POST(request: Request) {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json([]);
    }

    const cookieStore = await cookies();
    const { message } = await request.json();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const send = (data: ChatStreamResponse) => {
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                );
            };

            // Step 1: Processing
            send({ status: ChatRequestStatus.REVIEW });
            await writeToUserChatMain(userId, "user", "standard", message);

            // message too long
            if (!message || message.length > 200) {
                const responseMsg = welcomeResponse();
                await writeToUserChatMain(userId, "standard", "assistant", responseMsg);

                send({
                    status: ChatRequestStatus.DONE,
                    replies: [responseMsg]
                });
            }

            const aiInput = JSON.stringify({ message });
            console.log("dbg aiInput ", aiInput);

            let aiOutput = undefined;
            const checkEmbedding = process.env.SF_EMBEDDING_CHECK;
            console.log("dbg checkEmbedding ", checkEmbedding);
            if (checkEmbedding) {
                // 1. Call Gemini Embeddings API
                const embedding = await generateEmbedding(aiInput);

                // 2. Search PostgreSQL using pgvector
                const cachedAnswer = await findSimilarityOnLlmresultsByEmbedding(embedding);
                console.log("dbg cachedAnswer ", cachedAnswer);

                if (cachedAnswer && cachedAnswer.similarity >= 0.90) {
                    aiOutput = cachedAnswer.llmouput;    
                }
            }

            if (!aiOutput) {
                send({ status: ChatRequestStatus.THINKING });

                console.log("dbg call llm api ")
                // 4. Otherwise, call your LLM
                const result = await generateText({
                    model: deepSeek('deepseek-v4-pro'),
                    instructions: `
                        ${getBriefInstructions()}

                        ${getEditCartInstructions(1)}
                        ${getAddtocartInstructions(2)}
                        ${getCardDeletionInstructions(3)}

                        ${getPageNavigationInstructions(4)}
                        ${getAiTasksInstructions(5)}
                        ${getFoodSuggestion(6)}
                        ${getAnswerQuestionInstructions(7)}
                    `,
                    tools: {
                        getCuisineDetail: getCuisineDetail(cookieStore),
                        getUserCart: getUserCart(cookieStore),
                        getCuisines: getCuisines(cookieStore)
                    },
                    stopWhen: isStepCount(5),
                    messages: [{ content: message, role: "user" }]
                });
                aiOutput = await result.text;
            }


            const jsonResponse: AiChatResponse = JSON.parse(aiOutput);
            console.log("dbg aiOutput ", aiOutput)

            if (jsonResponse.editCart) {
                const data = await handleEditCart(userId, jsonResponse.editCart);
                send(data);
            } else if (jsonResponse.addToCart) {
                const data = await handleAddtocart(userId, jsonResponse.addToCart, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.deleteCart) {
                const data = await handleDeleteCart(userId, jsonResponse.deleteCart, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.navigate) {
                const data = await handleNavigation(userId, jsonResponse.navigate, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.chatBotTask === true) {
                const data = await handleDescribeTask(userId, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.answerQuestion) {
                const data = await handleAnswerQuestion(userId, jsonResponse.answerQuestion, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.foodSuggestion) {
                const data = await handleFoodSuggestion(userId, jsonResponse.foodSuggestion, aiInput, aiOutput);
                send(data);
            } else {
                const data = await handleDefaultAnswer(userId);
                send(data);
            }

            controller.close();
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
        },
    });
}