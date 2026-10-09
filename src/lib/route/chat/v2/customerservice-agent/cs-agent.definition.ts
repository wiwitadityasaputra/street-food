export enum CsAgentName {
    RhetoricianAgent = "RhetoricianAgent",
    NavigationAgent = "NavigationAgent"
}

export interface CsAgentResponse {
    agent: CsAgentName;
    message: string;
}