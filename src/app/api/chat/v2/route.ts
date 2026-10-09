import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateText, isStepCount, ModelMessage } from "ai";
import { deepSeek } from "@ai-sdk/deepseek";

import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { ChatRequestStatus, ChatStreamResponse } from "@/src/lib/route/chat/v1/chat.definition";
import { welcomeResponse } from "@/src/lib/route/chat/v1/responses";
import { findSimilarityOnLlmresultsByEmbedding, writeToUserChatMain } from "@/src/lib/database/database";
import { CsAgent } from "@/src/lib/route/chat/v2/customerservice-agent/cs-agent";
import { CsAgentName } from "@/src/lib/route/chat/v2/customerservice-agent/cs-agent.definition";
import { RhetoricianAgent } from "@/src/lib/route/chat/v2/rhetorician-agent/rhetorician-agent";
import { handleDefaultResponse } from "@/src/lib/route/chat/v2/handle-default-response";
import { NavigationAgent } from "@/src/lib/route/chat/v2/navigation-agent/nav-agent";
import { generateEmbedding } from "@/src/lib/route/chat/v1/util";


export async function POST(request: Request) {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json({}, { status: 401 });
    }

    const { message } = await request.json();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const send = (data: ChatStreamResponse) => {
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                );
            };

            send({ status: ChatRequestStatus.CS_AGENT_REVIEW });
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

            const csAgentInput: ModelMessage[] = [{ content: message, role: "user" }];
            const aiInput = JSON.stringify({ csAgentInput });
            console.log("POST /api/chat/v1 - aiInput ", aiInput);

            const csAgentOutput = await CsAgent(csAgentInput, send);
            if (csAgentOutput.agent === CsAgentName.NavigationAgent) {
                const data = await NavigationAgent(userId, [{ content: csAgentOutput.message, role: "user" }], send);
                send(data);
            } else if (csAgentOutput.agent === CsAgentName.RhetoricianAgent) {
                const data = await RhetoricianAgent(userId, [{ content: csAgentOutput.message, role: "user" }], send);
                send(data);
            } else {
                const data = await handleDefaultResponse(userId);
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