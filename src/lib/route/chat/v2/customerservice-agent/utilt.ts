import { AiAgentName } from "./cs-agent.definition";

export const isAgentInList = (previousAgent: AiAgentName[], agent: AiAgentName) => {
    return previousAgent.find(a => a === agent);
}