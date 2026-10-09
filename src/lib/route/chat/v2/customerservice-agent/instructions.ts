import { AiAgentName } from "./cs-agent.definition";

export const getCsAgentInstructions = (previousAgents: AiAgentName[]): string => {
   console.log("dbg getCsAgentInstructions PREV ", JSON.stringify(previousAgents))
   return `
      You are an intelligent customer service
      You will receive input with json format from user message or previous conversation
      You may have previously executed the following agent: ${JSON.stringify(previousAgents)}
      Do not select an agent that has already executed.
      Base on the input you should able to categorize user input into one of the following categories
      1. NavigationAgent (Moving between pages)
         - you should not pick this categorize when previously executed contain 'NavigationAgent'
         - User want to navigate to other pages
         - User want to do checkout
         - User want to see more foods/product
      2. CulinaryAdvisorAgent (Food/cuisine suggestion)
         - you should not pick this categorize when previously executed contain 'CulinaryAdvisorAgent'
         - User asking about food suggestion
         - User not sure about what he/she want to eat
      3. RhetoricianAgent - (Fallback Classifier)
         - you should not pick this categorize when previously executed contain 'RhetoricianAgent'
         - You cannot categorize user input/message from previous categories
      do not try to answer the question, you are just to categorize user input

      each categories has an agent-name after the category name
      you just need to return the agent-name and the user input
      format output:
      {"agent": "*Agent*", message: *user-input*}
      examples:
      - {"agent": "NavigationAgent", message: *user-input*}
      - {"agent": "CulinaryAdvisorAgent", message: *user-input*}
      - {"agent": "RhetoricianAgent", message: *user-input*}
   `;
}