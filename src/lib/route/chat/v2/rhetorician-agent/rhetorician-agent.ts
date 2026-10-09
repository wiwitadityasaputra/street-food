import { deepSeek } from "@ai-sdk/deepseek";
import { generateText, isStepCount, ModelMessage } from "ai";

import { RHETO_AGENT_LLMTYPE, RhetoricianAgentResponse } from "./rhetorician-agent.definition";
import { getRhetoricianAgentInstructions } from "./instrtuctions";
import { handleDefaultResponse } from "../handle-default-response";
import { ChatRequestStatus, ChatStreamResponse } from "../../v1/chat.definition";
import { findSimilarityOnLlmresultsByEmbedding, writeToLlmresults, writeToUserChatMain } from "@/src/lib/database/database";
import { generateEmbedding } from "../../v1/util";
import { DEEPSEEK_MODEL, SIMILARITY_THRESHOLD } from "@/src/lib/util/utils";

export const RhetoricianAgent = async (userId: string, messages: ModelMessage[]): Promise<ChatStreamResponse> => {
    const input = JSON.stringify({ messages });
    const checkEmbedding = process.env.SF_EMBEDDING_CHECK;

    console.log("RhetoricianAgent input ", input);
    console.log("RhetoricianAgent checkEmbedding ", checkEmbedding);

    let output = undefined;
    if (checkEmbedding) {
        const embedding = await generateEmbedding(input);
        const cachedAnswer = await findSimilarityOnLlmresultsByEmbedding(embedding, RHETO_AGENT_LLMTYPE);
        console.log("RhetoricianAgent cachedAnswer ", cachedAnswer);

        if (cachedAnswer && cachedAnswer.similarity >= SIMILARITY_THRESHOLD) {
            output = cachedAnswer.llmouput;
        }
    }

    if (!output) {
        console.log("RhetoricianAgent call llm ");
        const llmResponse = await generateText({
            model: deepSeek(DEEPSEEK_MODEL),
            instructions: `
                ${getRhetoricianAgentInstructions()}
            `,
            stopWhen: isStepCount(5),
            messages
        });
        output = await llmResponse.text;
        writeToLlmresults(input, output, RHETO_AGENT_LLMTYPE);
    }

    console.log("RhetoricianAgent output ", output);
    const outputObj: RhetoricianAgentResponse = JSON.parse(output);
    const isBad = outputObj.isBad;
    const rcResponse = outputObj.response;

    if (!isBad && rcResponse) {
        writeToUserChatMain(userId, "standard", "assistant", rcResponse);
        return {
            status: ChatRequestStatus.DONE,
            replies: [rcResponse]
        };
    } else {
        return handleDefaultResponse(userId);
    }
}