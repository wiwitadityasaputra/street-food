export enum CsAgentName {
    RhetoricianAgent = "RhetoricianAgent",
    NavigationAgent = "NavigationAgent",
    CulinaryAdvisorAgent = "CulinaryAdvisorAgent"
}

export interface CsAgentResponse {
    agent: CsAgentName;
    message: string;
}

export const CS_AGENT_LLMTYPE = "v2_cs_agent";