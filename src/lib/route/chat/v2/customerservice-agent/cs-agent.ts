import { deepSeek } from "@ai-sdk/deepseek";
import { generateText, isStepCount, ModelMessage } from "ai";

import { getCsAgentInstructions } from "@/src/lib/route/chat/v2/customerservice-agent/instructions";
import { CS_AGENT_LLMTYPE, AiAgentName, CsAgentResponse } from "@/src/lib/route/chat/v2/customerservice-agent/cs-agent.definition";
import { findSimilarityOnLlmresultsByEmbedding, writeToLlmresults } from "@/src/lib/database/database";
import { generateEmbedding } from "@/src/lib/route/chat/v1/util";
import { DEEPSEEK_MODEL, SIMILARITY_THRESHOLD } from "@/src/lib/util/utils";
import { ChatRequestStatus, ChatStreamResponse } from "@/src/lib/route/chat/v1/chat.definition";
import { NavigationAgent } from "@/src/lib/route/chat/v2/navigation-agent/nav-agent";
import { RhetoricianAgent } from "@/src/lib/route/chat/v2/rhetorician-agent/rhetorician-agent";
import { CulinaryAdvisorAgent } from "@/src/lib/route/chat/v2/culinsaryadivsor-agent/ca-agent";
import { handleDefaultResponse } from "@/src/lib/route/chat/v2/handle-default-response";

export const CustomerServiceAgent = async (userId: string, messages: ModelMessage[], previousAgents: AiAgentName[], send: (data: ChatStreamResponse) => void): Promise<CsAgentResponse> => {
    send({ status: ChatRequestStatus.CS_AGENT_REVIEW });
    const input = JSON.stringify({ messages });
    const checkEmbedding = process.env.SF_EMBEDDING_CHECK;

    console.log("CsAgent input ", input);
    console.log("CsAgent previousAgents ", previousAgents);
    console.log("CsAgent checkEmbedding ", checkEmbedding);

    let output = undefined;
    if (checkEmbedding && previousAgents.length === 0) {
        const embedding = await generateEmbedding(input);
        const cachedAnswer = await findSimilarityOnLlmresultsByEmbedding(embedding, CS_AGENT_LLMTYPE);
        console.log("CsAgent cachedAnswer ", cachedAnswer);

        if (cachedAnswer && cachedAnswer.similarity >= SIMILARITY_THRESHOLD) {
            output = cachedAnswer.llmouput;
        }
    }

    if (!output) {
        console.log("CsAgent call llm ");
        send({ status: ChatRequestStatus.CS_AGENT_THINKING });
        const response = await generateText({
            model: deepSeek(DEEPSEEK_MODEL),
            instructions: `
                ${getCsAgentInstructions(previousAgents)}
            `,
            stopWhen: isStepCount(5),
            messages
        });

        output = await response.text;
        writeToLlmresults(input, output, CS_AGENT_LLMTYPE);
    }

    console.log("CsAgent output ", output);
    const outputObj: CsAgentResponse = JSON.parse(output);

    if (outputObj.agent === AiAgentName.NavigationAgent) {
        await NavigationAgent(userId, [{ content: outputObj.message, role: "user" }], send);
    } else if (outputObj.agent === AiAgentName.RhetoricianAgent) {
        await RhetoricianAgent(userId, [{ content: outputObj.message, role: "user" }], send);
    } else if (outputObj.agent === AiAgentName.CulinaryAdvisorAgent) {
        await CulinaryAdvisorAgent(userId, [{ content: outputObj.message, role: "user" }], previousAgents, send);
    } else {
        const data = await handleDefaultResponse(userId);
        send(data);
    }

    return outputObj;
}