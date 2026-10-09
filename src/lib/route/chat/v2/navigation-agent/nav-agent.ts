import { generateText, isStepCount, ModelMessage } from "ai";
import { ChatRequestStatus, ChatStreamResponse } from "../../v1/chat.definition";
import { deepSeek } from "@ai-sdk/deepseek";
import { getPageNavigationInstructions } from "./instructions";
import { NAV_AGENT_LLMTYPE, NavAgentResponse } from "./nav-taent.definition";
import { cartNavigationRsponse, menuNavigationResponse } from "../../v1/responses";
import { findSimilarityOnLlmresultsByEmbedding, writeToLlmresults, writeToUserChatMain } from "@/src/lib/database/database";
import { generateEmbedding } from "../../v1/util";
import { DEEPSEEK_MODEL, SIMILARITY_THRESHOLD } from "@/src/lib/util/utils";

export const NavigationAgent = async (userId: string, messages: ModelMessage[], send: (data: ChatStreamResponse) => void): Promise<ChatStreamResponse> => {
    send({ status: ChatRequestStatus.NAV_AGENT_REVIEW });
    const input = JSON.stringify({ messages });
    const checkEmbedding = process.env.SF_EMBEDDING_CHECK;

    console.log("NavigationAgent input ", input);
    console.log("NavigationAgent checkEmbedding ", checkEmbedding);

    let output = undefined;
    if (checkEmbedding) {
        const embedding = await generateEmbedding(input);
        const cachedAnswer = await findSimilarityOnLlmresultsByEmbedding(embedding, NAV_AGENT_LLMTYPE);
        console.log("NavigationAgent cachedAnswer ", cachedAnswer);

        if (cachedAnswer && cachedAnswer.similarity >= SIMILARITY_THRESHOLD) {
            output = cachedAnswer.llmouput;
        }
    }

    if (!output) {
        console.log("NavigationAgent call llm ");
        send({ status: ChatRequestStatus.NAV_AGENT_THINKING });
        const llmResponse = await generateText({
            model: deepSeek(DEEPSEEK_MODEL),
            instructions: `
                ${getPageNavigationInstructions()}
            `,
            stopWhen: isStepCount(5),
            messages
        });
        output = await llmResponse.text;
        writeToLlmresults(input, output, NAV_AGENT_LLMTYPE);
    }

    console.log("NavigationAgent output ", output);
    const outputObj: NavAgentResponse = JSON.parse(output);
    const toPage = outputObj.toPage;

    if (toPage === "menu") {
        const responseMsg = menuNavigationResponse();
        writeToUserChatMain(userId, "standard", "assistant", responseMsg);
        return {
            status: ChatRequestStatus.DONE,
            replies: [responseMsg],
            action: "MENU"
        };
    } else {
        const responseMsg = cartNavigationRsponse();
        writeToUserChatMain(userId, "standard", "assistant", responseMsg);
        return {
            status: ChatRequestStatus.DONE,
            replies: [responseMsg],
            action: "CART"
        };
    }
}