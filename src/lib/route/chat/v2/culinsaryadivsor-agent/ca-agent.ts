import { generateText, isStepCount, ModelMessage } from "ai";
import { deepSeek } from "@ai-sdk/deepseek";

import { ChatRequestStatus, ChatStreamResponse } from "@/src/lib/route/chat/v1/chat.definition";
import { generateEmbedding } from "@/src/lib/route/chat/v1/util";
import {
    fetchCuisineByFoodsuggestion,
    findSimilarityOnLlmresultsByEmbedding,
    writeToLlmresults,
    writeToUserChatMain
} from "@/src/lib/database/database";
import { DEEPSEEK_MODEL, SIMILARITY_THRESHOLD } from "@/src/lib/util/utils";
import { CsAgentName, CsAgentResponse } from "@/src/lib/route/chat/v2/customerservice-agent/cs-agent.definition";
import { FoodSuggestion } from "@/src/lib/route/chat/v1/handle-bot-response";
import { CuisinesDbIdName } from "@/src/lib/database/database.definition";
import { unknownFoodDescriptionResponse } from "@/src/lib/route/chat/v1/responses";
import { RhetoricianAgent } from "@/src/lib/route/chat/v2/rhetorician-agent/rhetorician-agent";
import { handleDefaultResponse } from "@/src/lib/route/chat/v2/handle-default-response";

import { CA_AGENT_LLMTYPE, CaAgentResponse } from "@/src/lib/route/chat/v2/culinsaryadivsor-agent/ca-agent.definition";
import { getCulinaryAdvisorAgentInstructions } from "@/src/lib/route/chat/v2/culinsaryadivsor-agent/instructions";

export const CulinaryAdvisorAgent = async (userId: string, messages: ModelMessage[], send: (data: ChatStreamResponse) => void): Promise<ChatStreamResponse> => {
    send({ status: ChatRequestStatus.CA_AGENT_REVIEW });
    const input = JSON.stringify({ messages });
    const checkEmbedding = process.env.SF_EMBEDDING_CHECK;

    console.log("CulinaryAdvisorAgent input ", input);
    console.log("CulinaryAdvisorAgent checkEmbedding ", checkEmbedding);

    let output = undefined;
    if (checkEmbedding) {
        const embedding = await generateEmbedding(input);
        const cachedAnswer = await findSimilarityOnLlmresultsByEmbedding(embedding, CA_AGENT_LLMTYPE);
        console.log("CulinaryAdvisorAgent cachedAnswer ", cachedAnswer);
        if (cachedAnswer && cachedAnswer.similarity >= SIMILARITY_THRESHOLD) {
            output = cachedAnswer.llmouput;
        }
    }

    if (!output) {
        console.log("CulinaryAdvisorAgent call llm ");
        send({ status: ChatRequestStatus.CA_AGENT_THINKING });
        const llmResponse = await generateText({
            model: deepSeek(DEEPSEEK_MODEL),
            instructions: `
                ${getCulinaryAdvisorAgentInstructions()}
            `,
            stopWhen: isStepCount(5),
            messages
        });
        output = await llmResponse.text;
        writeToLlmresults(input, output, CA_AGENT_LLMTYPE);
    }

    console.log("CulinaryAdvisorAgent output ", output);
    const outputObj: CaAgentResponse | CsAgentResponse = JSON.parse(output);

    if ("agent" in outputObj) {
        if (outputObj.agent === CsAgentName.RhetoricianAgent) {
            return await RhetoricianAgent(userId, messages, send);
        } else {
            return await handleDefaultResponse(userId);
        }
    } else {
        const fs: FoodSuggestion  = {};
        if (outputObj.country) { fs.country = outputObj.country }
        if (outputObj.price) { fs.price = outputObj.price }
        if (outputObj.sales) { fs.sales = outputObj.sales }
        if (outputObj.rate) { fs.rate = outputObj.rate }

        const dbResults: CuisinesDbIdName[] = await fetchCuisineByFoodsuggestion(fs);
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
}