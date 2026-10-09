import { deepSeek } from "@ai-sdk/deepseek";
import { generateText, isStepCount, ModelMessage } from "ai";

import logger from "@/src/lib/util/logger";
import { RhetoricianAgentResponse } from "./rhetorician-agent.definition";
import { getRhetoricianAgentInstructions } from "./instrtuctions";
import { handleDefaultResponse } from "../handle-default-response";
import { ChatRequestStatus, ChatStreamResponse } from "../../v1/chat.definition";

export const RhetoricianAgent = async (userId: string, messages: ModelMessage[]): Promise<ChatStreamResponse> => {
    logger.info({messages}, "RhetoricianAgent input");
    const llmResponse = await generateText({
        model: deepSeek('deepseek-v4-pro'),
        instructions: `
            ${getRhetoricianAgentInstructions()}
        `,
        stopWhen: isStepCount(5),
        messages
    });
    const resultStr = await llmResponse.text;
    logger.info({resultStr}, "RhetoricianAgent resultStr");
    const output: RhetoricianAgentResponse = JSON.parse(resultStr);
    logger.info({output}, "RhetoricianAgent output");

    const isBad = output.isBad;
    const rcResponse = output.response;

    if (!isBad && rcResponse) {
        return {
            status: ChatRequestStatus.DONE,
            replies: [rcResponse]
        };
    } else {
        return handleDefaultResponse(userId);
    }
}