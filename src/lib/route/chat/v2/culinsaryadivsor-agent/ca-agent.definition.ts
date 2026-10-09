export enum CuisineType {
    indonesia = "indonesia",
    western = "western",
    chinese = "chinese",
    korean = "korean"
}

export enum PriceType {
    cheap = "cheap",
    expensive = "expensive"
}

export enum HighLowType {
    lowest = "lowest",
    highest = "highest"
}

export interface CaAgentResponse {
    country?: CuisineType;
    price?: PriceType;
    rate?: HighLowType;
    sales?: HighLowType;
}

export const CA_AGENT_LLMTYPE = "v2_ca_agent";