import { generateText, isStepCount, ModelMessage } from "ai";
import { ChatRequestStatus, ChatStreamOptionList, ChatStreamResponse } from "../../v1/chat.definition";
import { cartOptionsToReadable, DEEPSEEK_MODEL } from "@/src/lib/util/utils";
import { deepSeek } from "@ai-sdk/deepseek";
import { getWaitersAgentInstructions } from "./instructions";
import { WaitersAgentResponse } from "./waiters-agent.definition";
import { handleDefaultResponse } from "../handle-default-response";
import { deleteUserCartApi } from "../../v1/util";
import { cookies } from "next/headers";
import { multipleItemsToBeDeletedResponse, removeCartResponse } from "../../v1/responses";
import { fetchUserCartIdByUseridAndCuisinename, writeToUserChatMain } from "@/src/lib/database/database";
import { UserCartFeCartApi } from "@/src/lib/database/database.definition";
import { getUserCart } from "../../v1/tools";
import { AiAgentName } from "../customerservice-agent/cs-agent.definition";
import { CustomerServiceAgent } from "../customerservice-agent/cs-agent";
import { RhetoricianAgent } from "../rhetorician-agent/rhetorician-agent";

export const WaitersAgent = async (userId: string, messages: ModelMessage[], previousAgents: AiAgentName[], send: (data: ChatStreamResponse) => void): Promise<CsAgentResponse> => {
    send({ status: ChatRequestStatus.WAITERS_AGENT_THINKING });

    const input = JSON.stringify({ messages });
    console.log("WaitersAgent input ", input);

    const cookieStore = await cookies();
    const response = await generateText({
        model: deepSeek(DEEPSEEK_MODEL),
        instructions: `
            ${getWaitersAgentInstructions()}
        `,
        stopWhen: isStepCount(5),
        messages,
        tools: {
            getUserCart: getUserCart(cookieStore),
        },
    });

    const output = await response.text;
    console.log("WaitersAgent output ", output);
    const outputObj: WaitersAgentResponse | any = JSON.parse(output);
    if ("userCartIds" in outputObj) {
        console.log("WaitersAgent userCartIds exist");
        const ids: number[] = outputObj["userCartIds"];
        if (ids.length === 1) {
            console.log("WaitersAgent userCartIds ids.length=1");
            const userCartId: number = ids[0];
            await processDeleteOnedata(userCartId, userId, send);
        } else if (ids.length > 1) {
            console.log("WaitersAgent userCartIds ids.length>1");
            const cuisineName = outputObj["cuisineName"];
            const carts: UserCartFeCartApi[] = await fetchUserCartIdByUseridAndCuisinename(userId, cuisineName);
            if (carts.length > 1) {
                console.log("WaitersAgent userCartIds ids.length>1 carts.length>1");
                await processDeleteMoredata(cuisineName, carts, userId, send);
            } else if (carts.length === 1) {
                console.log("WaitersAgent userCartIds ids.length>1 carts.length=1");
                await processDeleteOnedata(carts[0].userCartId, userId, send);
            } else {
                console.log("WaitersAgent userCartIds ids.length>1 carts.length=0");
                await RhetoricianAgent(userId, messages, send);
            }            
        } else {
            console.log("WaitersAgent userCartIds ids.length=0");
            await RhetoricianAgent(userId, messages, send);
        }
    } else {
        console.log("WaitersAgent userCartIds not-exist");
        await RhetoricianAgent(userId, messages, send);
    }
}

const processDeleteMoredata = async (cuisineName: string, carts: UserCartFeCartApi[], userId: string, send: (data: ChatStreamResponse) => void) => {
    const m = multipleItemsToBeDeletedResponse(cuisineName);
    await writeToUserChatMain(userId, "assistant", "standard", m);

    const options: ChatStreamOptionList[] = [];
    const replies = [ m ];
    for (const [index, c] of carts.entries()) {
        const message = cartOptionsToReadable(cuisineName, c.finalPrice, index + 1, c.options);
        options.push({
            label: message,
            value: `Remove from cart: ${cartOptionsToReadable(cuisineName, c.finalPrice, undefined, c.options)}`
        })
        replies.push(message);
    }
    const data = {
        status: ChatRequestStatus.DONE,
        action: "CART",
        option: {
            message: m,
            options: options
        }
    };
    send(data);
} 

const processDeleteOnedata = async (userCartId: number, userId: string, send: (data: ChatStreamResponse) => void) => {
    const deleteUrl = await deleteUserCartApi(userCartId);
    const cookieStore = await cookies();
    const deleteResponse = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
            Cookie: cookieStore.toString()
        },
    });
    const bodyResponse = await deleteResponse.json();
    const totalCart = bodyResponse.totalCart;

    const responseMsg = removeCartResponse();
    await writeToUserChatMain(userId, "assistant", "standard", responseMsg);
    const data = {
        status: ChatRequestStatus.DONE,
        replies: [responseMsg],
        action: "CART",
        totalCart
    };
    send(data);
}
