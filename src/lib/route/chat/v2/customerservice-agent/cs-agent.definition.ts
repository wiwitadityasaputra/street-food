export enum AiAgentName {
    CustomerServiceAgent = "CustomerServiceAgent",
    DescribeTasksAgent = "DescribeTasksAgent",
    RhetoricianAgent = "RhetoricianAgent",
    NavigationAgent = "NavigationAgent",
    CulinaryAdvisorAgent = "CulinaryAdvisorAgent",
    WaitersAgent = "WaitersAgent"
}

export interface CsAgentResponse {
    agent: AiAgentName;
    message: string;
}

export interface CaAgentRespoponseBacktoCs {
    backToCs: boolean;
}

export const CS_AGENT_LLMTYPE = "v2_cs_agent";