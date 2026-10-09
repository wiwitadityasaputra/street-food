import { deepSeek } from "@ai-sdk/deepseek";
import { generateText, isStepCount, ModelMessage } from "ai";
import { getCsAgentInstructions } from "./instructions";
import logger from "@/src/lib/util/logger";
import { CsAgentResponse } from "./cs-agent.definition";

export const CsAgent = async (messages: ModelMessage[]): Promise<CsAgentResponse> => {
    logger.info({messages}, "CsAgent input");
    const response = await generateText({
        model: deepSeek('deepseek-v4-pro'),
        instructions: `
            ${getCsAgentInstructions()}
        `,
        stopWhen: isStepCount(5),
        messages
    });
    const resultStr =  await response.text;
    logger.info({resultStr}, "CsAgent resultStr");
    const output: CsAgentResponse = JSON.parse(resultStr);
    logger.info({output}, "CsAgent output");
    return output;
}