import { NextResponse } from "next/server";
import { deepSeek } from '@ai-sdk/deepseek';
import { generateText, isStepCount } from 'ai';
import { cookies } from "next/headers";

import { getCookieData } from "@/src/lib/util/cookie-util";
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

const V1_FLOW_DELAY_MS = 1000;

export async function POST(request: Request) {
    const cookieData = await getCookieData();
    const userId = cookieData.userId;
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
            const sendV1Flow = async (v1Flow: V1Flow) => {
                send({ v1Flow });
                if (cookieData.delay) {
                    await new Promise((resolve) => setTimeout(resolve, V1_FLOW_DELAY_MS));
                }
            };

            // Step 1: Processing
            await sendV1Flow(V1Flow.USER_TO_CS);
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
                await sendV1Flow(V1Flow.CS_TO_GEMINI);
                const embedding = await generateEmbedding(aiInput);

                // 2. Search PostgreSQL using pgvector
                await sendV1Flow(V1Flow.GEMINI_TO_CS);
                const cachedAnswer = await findSimilarityOnLlmresultsByEmbedding(embedding, "v1");
                console.log("POST /api/chat/v1 - cachedAnswer ", cachedAnswer);

                if (cachedAnswer && cachedAnswer.similarity >= SIMILARITY_THRESHOLD) {
                    // 3. Found the data with high similarity threshold, check similarity
                    aiOutput = cachedAnswer.llmouput;
                }
            }

            if (!aiOutput) {
                // 4. Call llm api
                await sendV1Flow(V1Flow.CS_TO_LLM);
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

                await sendV1Flow(V1Flow.LLM_TO_CS);
                aiOutput = await result.text;
            }
            console.log("POST /api/chat/v1 - aiOutput ", aiOutput);
            const jsonResponse: AiChatResponse = JSON.parse(aiOutput);

            if (jsonResponse.editCart) {
                await sendV1Flow(V1Flow.CS_TO_CART_EDIT);
                const data = await handleEditCart(userId, jsonResponse.editCart, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.addToCart) {
                await sendV1Flow(V1Flow.CS_TO_CART_ADD);
                const data = await handleAddtocart(userId, jsonResponse.addToCart, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.deleteCart) {
                await sendV1Flow(V1Flow.CS_TO_CART_DELETE);
                const data = await handleDeleteCart(userId, jsonResponse.deleteCart, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.navigate) {
                await sendV1Flow(V1Flow.CS_TO_PAGE_NAV);
                const data = await handleNavigation(userId, jsonResponse.navigate, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.chatBotTask === true) {
                await sendV1Flow(V1Flow.CS_TO_DESCRIBE_TASK);
                const data = await handleDescribeTask(userId, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.answerQuestion) {
                await sendV1Flow(V1Flow.CS_TO_AQ);
                const data = await handleAnswerQuestion(userId, jsonResponse.answerQuestion, aiInput, aiOutput);
                send(data);
            } else if (jsonResponse.foodSuggestion) {
                await sendV1Flow(V1Flow.CS_TO_FOOD_SUGGEST);
                const data = await handleFoodSuggestion(userId, jsonResponse.foodSuggestion, aiInput, aiOutput);
                send(data);
            } else {
                await sendV1Flow(V1Flow.CS_TO_DEFAULT_RESPONSE);
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