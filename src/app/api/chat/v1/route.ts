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
} from "@/src/lib/route/chat/v1/instructions";
import {
    welcomeResponse
} from "@/src/lib/route/chat/v1/responses";
import {
    generateEmbedding
} from "@/src/lib/route/chat/v1/util";
import { getCuisineDetail, getCuisines, getUserCart } from "@/src/lib/route/chat/v1/tools";
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
} from "@/src/lib/route/chat/v1/handle-bot-response";
import {
    ChatRequestStatus,
    ChatStreamResponse,
    V1Flow
} from "@/src/lib/route/chat/v1/chat.definition";
import { SIMILARITY_THRESHOLD } from "@/src/lib/util/utils";

export async function POST(request: Request) {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json({}, { status: 401 });
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
            console.log("POST /api/chat/v1 - aiInput ", aiInput)

            let aiOutput = undefined;
            const checkEmbedding = process.env.SF_EMBEDDING_CHECK;
            console.log("POST /api/chat/v1 - checkEmbedding ", checkEmbedding)

            if (checkEmbedding) {
                // 1. Call Gemini Embeddings API
                send({ v1Flow: V1Flow.CS_TO_GEMINI });
                const embedding = await generateEmbedding(aiInput);

                // 2. Search PostgreSQL using pgvector
                send({ v1Flow: V1Flow.GEMINI_TO_CS });
                const cachedAnswer = await findSimilarityOnLlmresultsByEmbedding(embedding, "v1");
                console.log("POST /api/chat/v1 - cachedAnswer ", cachedAnswer);

                if (cachedAnswer && cachedAnswer.similarity >= SIMILARITY_THRESHOLD) {
                    // 3. Found the data with high similarity threshold, check similarity
                    aiOutput = cachedAnswer.llmouput;
                }
            }

            if (!aiOutput) {
                // 4. Call llm api
                send({ v1Flow: V1Flow.CS_TO_LLM });
                send({ status: ChatRequestStatus.THINKING });

                console.log("POST /api/chat/v1 - call llm")
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

                send({ v1Flow: V1Flow.LLM_TO_CS });
                aiOutput = await result.text;
            }
            console.log("POST /api/chat/v1 - aiOutput ", aiOutput);
            const jsonResponse: AiChatResponse = JSON.parse(aiOutput);

            if (jsonResponse.editCart) {
                send({ v1Flow: V1Flow.CS_TO_CART_EDIT });
                const data = await handleEditCart(userId, jsonResponse.editCart, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.addToCart) {
                send({ v1Flow: V1Flow.CS_TO_CART_ADD });
                const data = await handleAddtocart(userId, jsonResponse.addToCart, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.deleteCart) {
                send({ v1Flow: V1Flow.CS_TO_CART_DELETE });
                const data = await handleDeleteCart(userId, jsonResponse.deleteCart, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.navigate) {
                send({ v1Flow: V1Flow.CS_TO_PAGE_NAV });
                const data = await handleNavigation(userId, jsonResponse.navigate, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.chatBotTask === true) {
                send({ v1Flow: V1Flow.CS_TO_DESCRIBE_TASK });
                const data = await handleDescribeTask(userId, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.answerQuestion) {
                send({ v1Flow: V1Flow.CS_TO_AQ });
                const data = await handleAnswerQuestion(userId, jsonResponse.answerQuestion, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.foodSuggestion) {
                send({ v1Flow: V1Flow.CS_TO_FOOD_SUGGEST });
                const data = await handleFoodSuggestion(userId, jsonResponse.foodSuggestion, aiInput, aiOutput);
                send(data);
            } else {
                send({ v1Flow: V1Flow.CS_TO_DEFAULT_RESPONSE });
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