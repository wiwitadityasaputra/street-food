import { deepSeek } from "@ai-sdk/deepseek";
import { generateText, isStepCount, ModelMessage } from "ai";
import { getCsAgentInstructions } from "./instructions";
import { CS_AGENT_LLMTYPE, CsAgentResponse } from "./cs-agent.definition";
import { findSimilarityOnLlmresultsByEmbedding, writeToLlmresults } from "@/src/lib/database/database";
import { generateEmbedding } from "../../v1/util";
import { DEEPSEEK_MODEL, SIMILARITY_THRESHOLD } from "@/src/lib/util/utils";

export const CsAgent = async (messages: ModelMessage[]): Promise<CsAgentResponse> => {
    const input = JSON.stringify({ messages });
    const checkEmbedding = process.env.SF_EMBEDDING_CHECK;

    console.log("CsAgent input ", input);
    console.log("CsAgent checkEmbedding ", checkEmbedding);

    let output = undefined;
    if (checkEmbedding) {
        const embedding = await generateEmbedding(input);
        const cachedAnswer = await findSimilarityOnLlmresultsByEmbedding(embedding, CS_AGENT_LLMTYPE);
        console.log("CsAgent cachedAnswer ", cachedAnswer);

        if (cachedAnswer && cachedAnswer.similarity >= SIMILARITY_THRESHOLD) {
            output = cachedAnswer.llmouput;
        }
    }

    if (!output) {
        console.log("CsAgent call llm ");
        const response = await generateText({
            model: deepSeek(DEEPSEEK_MODEL),
            instructions: `
                ${getCsAgentInstructions()}
            `,
            stopWhen: isStepCount(5),
            messages
        });

        output = await response.text;
        writeToLlmresults(input, output, CS_AGENT_LLMTYPE);
    }

    console.log("CsAgent output ", output);
    const outputObj: CsAgentResponse = JSON.parse(output);
    return outputObj;
}