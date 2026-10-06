import { NextResponse } from "next/server";
import { deepSeek } from '@ai-sdk/deepseek';
import { generateText, isStepCount, tool } from 'ai';
import { z } from 'zod';
import { cookies,headers } from "next/headers";

import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { writeToUserChatMain } from "@/src/lib/database/database";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { UserCartRoutePostRequest } from "../cart/route";
import { CuisineDetailGetResponse } from "../cuisines/[id]/route";
import { getAddtocartInstructions, getAiTasksInstructions, getAnswerQuestionInstructions, getCardDeletionInstructions, getPageNavigationInstructions } from "../../menu/chat/instructions";

export async function POST(request: Request) {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json([]);
    }
    const cookieStore = await cookies();
    const headersList = await headers();
    const referrer = headersList.get('referer');
    if (!referrer) {
        return NextResponse.json([]);
    }
    const url = new URL(referrer);
    const segments = url.pathname.split('/').filter(Boolean);
    const page = segments.pop();

    const { message } = await request.json();
    if (!message || message.length > 50) {
        const responseMsg = welcomeResponse();
        await writeToUserChatMain(userId, responseMsg, "assistant");

        return NextResponse.json({
            replies: [responseMsg]
        });
    }
    await writeToUserChatMain(userId, message, "user");

    const userCartsApi = await getUserCartsApi();
    const cartData = await getDataFromApi(userCartsApi, cookieStore);

    const cuisineApi = await getCuisinesApi();
    const cuisines = await getDataFromApi(cuisineApi, cookieStore);

    /*
        {
            "input": {
                "message": *user message*,
                "page": "cart" // "menu" | "cart"
            },
            "output": {
                "addToCart": {
                    "cuisineName": *cuisineName*,
                    "isValid": true/false

                    "cuisineId": *cuisineId*,
                    "quantity": *quantity*
                    "addOns": [1,3,3]
                },
                "navigate": {
                    "toPage": "cart" // "menu" | "cart"
                },
                "deleteCart": {
                    "userCartId": 31
                },
                "chatBotTask": true/false,
                "answeringQuestions": {
                    "isBadQuestion": true/false,
                    "response": *ai response*
                }
            }
        }
    */

    const result = await generateText({
        model: deepSeek('deepseek-v4-pro'),
        instructions: `
            You are an intelligent assistant for a street-food e-commerce application.
            you will receive input with json format like
            { "message": *user message*, "page": "cart" }
            page can either "menu" or cart "cart"

            base on user input you should able to 
            categorize user input into one of the following categories

            ${getAddtocartInstructions(1, cuisines)}

            ${getPageNavigationInstructions(2)}

            ${getCardDeletionInstructions(3, cartData)}

            ${getAiTasksInstructions(4)}

            ${getAnswerQuestionInstructions(5)}
        `,
        tools: {
            getCuisineDetail: tool({
                inputSchema: z.object({
                    cuisineId: z.number()
                }),
                execute: async ({
                    cuisineId
                }): Promise < any > => {
                    const url = await getCuisineDetailApi(String(cuisineId));
                    try {
                        const response = await fetch(url, {
                            headers: {
                                Cookie: cookieStore.toString()
                            },
                        });
                        const result: CuisineDetailGetResponse = await response.json();
                        return result;
                    } catch (e) {
                        console.error(`Failed to fetch ${url}`, e);
                        return {};
                    }
                }
            })
        },
        stopWhen: isStepCount(5),
        prompt: JSON.stringify({ message, page })
    });

    const finalResponse = await result.text;
    console.log("dbg finalResponse ", finalResponse)
    const jsonResponse = JSON.parse(finalResponse);
    console.log("dbg jsonResponse ", jsonResponse)

    if (jsonResponse.navigate) {
        const toPage = jsonResponse.navigate.toPage;

        if (toPage === "menu") {
            const responseMsg = menuNavigationResponse();
            await writeToUserChatMain(userId, responseMsg, "assistant", finalResponse);
            return NextResponse.json({
                replies: [responseMsg],
                action: "MENU"
            });
        } else {
            const responseMsg = cartNavigationRsponse();
            await writeToUserChatMain(userId, responseMsg, "assistant", finalResponse);
            return NextResponse.json({
                replies: [responseMsg],
                action: "CART"
            });
        }
    } else if (jsonResponse.deleteCart && jsonResponse.deleteCart.userCartId) {
        const userCartId  = jsonResponse.deleteCart.userCartId;
        try {

            const deleteUrl = await deleteUserCartApi(userCartId);
            const deleteResponse = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    Cookie: cookieStore.toString()
                },
            });
            const bodyResponse = await deleteResponse.json();
            const totalCart = bodyResponse.totalCart;

            const responseMsg = removeCartResponse();
            await writeToUserChatMain(userId, responseMsg, "assistant");
            return NextResponse.json({
                replies: [responseMsg],
                action: "CART",
                totalCart
            });
        } catch (e) {
            console.error("error ", e)
            const responseMsg = welcomeResponse();
            return NextResponse.json({
                replies: [responseMsg]
            });
        }
    } else if (jsonResponse.chatBotTask === true) {
        const responses = [
            "Hi i able to do following task",
            "1. Move between menu & cart page only.",
            "2. Delete food from your cart.",
            "3. Adding food to your cart.",
            "4. Asking your random questions.",
        ];
        responses.forEach(r => {
            writeToUserChatMain(userId, r, "assistant", finalResponse);
        })
        return NextResponse.json({
            action: "AI_TASKS",
            replies: responses
        });
    } else if (jsonResponse.answerQuestion) {
        const answerQuestion = jsonResponse.answerQuestion;
        const isBad = answerQuestion.isBad;
        const response = answerQuestion.response;
        if (!isBad && response) {
            await writeToUserChatMain(userId, response, "assistant");
            return NextResponse.json({
                replies: [response]
            });
        } else {
            const badQuestResponse = badQuestionResponse();
            await writeToUserChatMain(userId, badQuestResponse, "assistant");

            const responseMsg = welcomeResponse();
            await writeToUserChatMain(userId, responseMsg, "assistant");

            return NextResponse.json({
                replies: [badQuestResponse, responseMsg]
            });
        }
    } else if (jsonResponse.addToCart) {
        const addToCart = jsonResponse.addToCart;
        const isValid = addToCart.isValid;
        const cuisineName = addToCart.cuisineName;

        if (!isValid) {
            const reply = unknownFoodResponse(cuisineName);
            await writeToUserChatMain(userId, reply, "assistant", finalResponse);
            return NextResponse.json({
                replies: [reply]
            });
        } else {
            const cuisineId = addToCart.cuisineId;
            const quantity = addToCart.quantity;
            const addOnsIds = addToCart.addOnsIds;

            const postBody: UserCartRoutePostRequest = {
                cuisineId: cuisineId,
                quantity: quantity,
                addOnsIds: addOnsIds
            };

            const reply = validFoodResponse(cuisineName);
            await writeToUserChatMain(userId, reply, "assistant", finalResponse);

            let totalCart = 0;
            try {
                const response = await fetch(userCartsApi, {
                    method: 'POST',
                    headers: {
                        Cookie: cookieStore.toString(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postBody)
                });
                const bodyResponse = await response.json();
                totalCart = bodyResponse.totalCart;
            } catch (e) {
                console.error(`Failed to post new cart data `, e);
            }

            return NextResponse.json({
                replies: [reply],
                action: "CART",
                totalCart
            });
        }

    } else {
        const badQuestResponse = badQuestionResponse();
        await writeToUserChatMain(userId, badQuestResponse, "assistant");

        const responseMsg = welcomeResponse();
        await writeToUserChatMain(userId, responseMsg, "assistant");

        return NextResponse.json({
            replies: [badQuestResponse, responseMsg]
        });
    }
}

const generateApi = async function(apiPath: string) {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    return `${protocol}://${host}/api/${apiPath}`;
}

const getUserCartsApi = async function() {
    return generateApi("cart");
}

const deleteUserCartApi = async function(userCartId: string) {
    return generateApi("cart/" + userCartId);
}

const getCuisinesApi = async function() {
    return generateApi("cuisines");
}

const getCuisineDetailApi = async function(cuisineId: string) {
    return generateApi(`cuisines/${cuisineId}`);
}

const getDataFromApi = async function(api: string, cookieStore: ReadonlyRequestCookies) {
    try {
        const response = await fetch(api, {
            headers: {
                Cookie: cookieStore.toString()
            },
        });
        return await response.json();
    } catch (e) {
        console.error(`Failed to fetch ${api}`, e);
        return [];
    }
}

const cartNavigationRsponse = () => {
    const list = [
        "Almost ready to feast? Review your items in the cart and breeze through checkout when you are set!",
        "Hungry yet? Double-check your cravings in the cart and zip right through checkout!",
        "Almost chow time! Take one last look at your order and breeze through to checkout.",
        "Feast mode: loading... Review your cart and secure your meal in a snap!",
        "Ready to eat? Check your cart and breeze through checkout.",
        "One last look at your meal before you lock it in!",
        "Review your order and speed through checkout when you're ready.",
        "Looks like a delicious spread! Take a quick peek at your cart to finalize your order.",
        "Almost time to dig in. Review your items and complete your checkout with ease.",
        "Everything look good? Breeze through checkout whenever you're ready to order.",
    ];
    return list[Math.floor(Math.random() * list.length)];
}

const menuNavigationResponse = () => {
    const list = [
        "Welcome back! Dive right into our delicious menu and find your next favorite meal today!",
        "Great to see you again! Explore our mouthwatering menu and discover a new flavor to love today.",
        "Welcome back! Jump right into our delicious offerings and treat yourself to something amazing.",
        "So glad you're back! Take a look at our tasty menu and find your next go-to favorite.",
        "Look who's back! Check out our menu and dive into a meal you'll crave all over again.",
        "Welcome back! Ready for another great bite? Browse our menu and pick something tasty.",
        "Hey there, welcome back! See what's cooking and find your next favorite dish today.",
        "Welcome back! Dive into our delicious menu and find your next crave-worthy meal.",
        "Great to have you back! Explore our menu to discover your next delicious obsession.",
    ];
    return list[Math.floor(Math.random() * list.length)];
}

const removeCartResponse = () => {
    const list = [
        "Successfully removed the selected item from your cart! Enjoy your next delicious pick!",
        "Your item has been removed successfully! Hope you find something else tasty!",
        "All set! The selected item has been removed from your cart.",
        "Poof! Your selected item is out of the cart. Ready for something else tasty?",
        "Removed successfully! Your cart is looking a little lighter now.",
        "Got it! The selected item has been removed from your cart.",
        "Done and dusted! Your selected item has been removed from the cart.",
        "No worries! The selected item has been removed from your cart.",
        "All done! Your selected item is no longer in your cart. Happy eating!",
        "Removed! Your cart is updated and ready for your next craving.",
        "Consider it done! The selected item has been removed from your cart.",
        "Nice and easy! Your selected item has been removed from your cart.",
        "Your cart is updated! The selected item has been successfully removed.",
        "Goodbye, tasty item! It has been removed from your cart successfully.",
        "Done! That item has been cleared from your cart. Enjoy your next bite!",
    ];
    return list[Math.floor(Math.random() * list.length)];
}

const welcomeResponse = () => {
    const list = [
        "Welcome! Craving something delicious today? Let me know how I can help you out.",
        "Hi! Hungry? Browse our menu and place your order in just a few clicks.",
        "Welcome! Ready to order? Tell me what you're craving or check out our bestsellers.",
        "Welcome! What can I get started for your delivery or pickup order today?",
        "Hi! View our menu, add your favorites to the cart, and checkout instantly right here.",
        "Welcome to Street-Food! Let's get your food on the way. What would you like to order?",
        "Food emergency? I've got you covered. Let's find your next favorite meal!",
        "Hey! Skip the cooking tonight. What can I add to your order?"
    ];
    return list[Math.floor(Math.random() * list.length)];
}

const badQuestionResponse = () => {
    const list = [
        "Sorry, I can't answer that topic.",
        "I don't have an answer for that.",
        "I can only help with menu items and orders.",
        "That's outside what I can help with.",
        "I'm unable to assist with that request.",
        "Please ask something related to our menu or ordering.",
        "I can't help with that question."
    ];
    return list[Math.floor(Math.random() * list.length)];
}

const unknownFoodResponse = (food: string) => {
    const f = food.charAt(0).toUpperCase() + food.slice(1);
    const list = [
        `I apologize, but we are currently out of ${f} at the moment.`,
        `So sorry, we are completely fresh out of ${f} today!`,
        `Unfortunately, ${f} is temporarily unavailable on our menu.`,
        `${f} isn't available today, but our chef can recommend a great alternative if you'd like!`,
        `We hate to break the news, but ${f} isn't available right now.`,
        `I am so sorry for the disappointment, but we're unable to serve ${f} right now.`
    ];
    return list[Math.floor(Math.random() * list.length)];
}

const validFoodResponse = (food: string) => {
    const f = food.charAt(0).toUpperCase() + food.slice(1);
    const list = [
        `Awesome, ${f} is in your cart!`,
        `You got it, ${f} added to cart!`,
        `Excellent choice, ${f} is in your cart!`,
        `Nice! ${f} has been successfully added to your cart.`,
        `Done! That ${f} is now chilling in your cart.`,
        `Sweet! Your ${f} has been added to the cart.`
    ];
    return list[Math.floor(Math.random() * list.length)];
}