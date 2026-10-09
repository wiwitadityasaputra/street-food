import logger from "@/src/lib/util/logger";
import { generateText, isStepCount, ModelMessage } from "ai";
import { ChatRequestStatus, ChatStreamResponse } from "../../v1/chat.definition";
import { deepSeek } from "@ai-sdk/deepseek";
import { getPageNavigationInstructions } from "./instructions";
import { NavAgentResponse } from "./nav-taent.definition";
import { cartNavigationRsponse, menuNavigationResponse } from "../../v1/responses";

export const NavigationAgent = async (userId: string, messages: ModelMessage[]): Promise<ChatStreamResponse> => {
    logger.info({messages}, "NavigationAgent input");
    const llmResponse = await generateText({
        model: deepSeek('deepseek-v4-pro'),
        instructions: `
            ${getPageNavigationInstructions()}
        `,
        stopWhen: isStepCount(5),
        messages
    });
    const resultStr = await llmResponse.text;
    logger.info({resultStr}, "NavigationAgent resultStr");
    const output: NavAgentResponse = JSON.parse(resultStr);
    logger.info({output}, "NavigationAgent output");

    const toPage = output.toPage;
    if (toPage === "menu") {
        const responseMsg = menuNavigationResponse();
        return {
            status: ChatRequestStatus.DONE,
            replies: [responseMsg],
            action: "MENU"
        };
    } else {
        const responseMsg = cartNavigationRsponse();
        return {
            status: ChatRequestStatus.DONE,
            replies: [responseMsg],
            action: "CART"
        };
    }
}