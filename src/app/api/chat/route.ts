import { NextResponse } from "next/server";
import { deepSeek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';
import { cookies, headers } from "next/headers";

import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { writeToUserChatMain } from "@/src/lib/database/database";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

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
    const lastPath = segments.pop(); 

    const { message } = await request.json();
    await writeToUserChatMain(userId, message, "user");

    const userCartsApi = await getUserCartsApi();
    const cartData = await getDataFromApi(userCartsApi, cookieStore);

    const cuisineApi = await getCuisinesApi();
    const cuisines = await getDataFromApi(cuisineApi, cookieStore);

    const result = await generateText({
        model: deepSeek('deepseek-flash'),
        system: `
            You are an intelligent assistant for a street-food e-commerce application. 
            The application currently consists of only two pages:
            1. Menu
            2. Cart

            You have some sequential tasks todo
            ### Task No 1: Adding food to cart.
            You should able to understand that user want to adding new food/cuisine to their cart
            You need to know the amount of food the user wants
            If the user does not enter a quantity, assume it is just one
            Task No 1 final message should be FOOD_INPUT_{cuisineId}_{amount of food}

            for examples:
            - user want adding 10 Ketoprak (the Ketoprak id is 20)
              final message will: FOOD_INPUT_20_10_Ketoprak
            - user want adding Eomuk (Eomuk id is 8)
              final message will: FOOD_INPUT_8_1_Eomuk

            All foods/cuisines Data: ${JSON.stringify(cuisines)}

            If the user want add other food that is not in our foods/cuisines data
            then Task No 1 final message wlll be: FOOD_UNKNOWN_{food name / cuisine name}
            for example: 
            - user want to add 10 Pizza or user want to add Rujak
              final message will: FOOD_UNKNOWN_pizza or FOOD_UNKNOWN_rujak
            
            If the user input does not fall into the category above or Task No 1,
            then you can continue to Task No 2 below

            ### Task No 2: To analyze the user's current page context and their latest input, intent, or action,
            and decide where they should navigate next.

            You must choose strictly one of the following three options:
            - "MENU": Navigate the user to the menu page.
            - "CART": Navigate the user to the cart page.
            - "STAY": Do not navigate; stay on the current page because the intent is unclear or irrelevant to navigation.

            #### Guidelines:
            - If the user expresses a desire to view products, go back, shop, or see the main store, choose "MENU".
            - If the user asks about their items, checkout, total price, or viewing selected products, choose "CART".
            - If the user's request is ambiguous, unrelated to navigation, or requires staying on the current view, choose "STAY".

            #### Examples:
            User Input: "[current-page='menu']Show me my items"
            Current Page: Menu
            Output: CART

            User Input: "[current-page='cart']Take me back to the shop"
            Current Page: Cart
            Output: MENU

            User Input: "[current-page='menu']What's the weather like today?"
            Current Page: Menu
            Output: STAY

            Result for Task No 2 is ONLY with one of the two exact navigation commands: MENU or CART
            from Task No 2 result, if MENU or CART then skip there
            no need to continue to next tasks
            or when you can't decided the Task No 2 result, you can continue to Task No 3 below

            ### Task No 3: Cart Deletion
            If the user wants to remove a specific food, match their requested food name 
            against the user's current cart data provided below.

            Current User Cart Data: ${JSON.stringify(cartData)}

            - If a matching food is found, output exactly: DELETE_ID__{userCartId}
            - If no food matching with User Cart Data you can continue to Task No 4 below

            ### Task No 4: Capability Inquiry AI_TASKS
            - **Trigger:** If the user asks what you can do, what your features are,
                how you can help, or requests a list of your capabilities 
                (e.g., "What can you do?", "How do you work?", "Show me your features"):
            - **Action:** Immediately return the exact keyword AI_TASKS

            ### Task No 5: Fallback Classifier & Response Handler
            Trigger this task ONLY when a user message cannot be classified or handled
            by previous task
            I want you to just answering user message/question
            The response must be strictly **under 50 characters
            final message should be AI_RESPONSE_{response}

            but when the question are falls into the category of
            - Race, ethnicity, or nationality.
            - Religion, faith, or religious beliefs.
            final message should be AI_RESPONSE_BAD
        `,
        prompt: "[current-page='" + lastPath + "']" + message
    });

    const finalResponse = await result.text;
    console.log("dbg finalRespons ", finalResponse)
    if (finalResponse.indexOf("MENU") === 0) {
        console.log("dbg step menu")
        const responseMsg = menuNavigationResponse();
        await writeToUserChatMain(userId, responseMsg, "assistant");
        return NextResponse.json({
            replies: [responseMsg],
            action: "MENU"
        });
    } else if (finalResponse.indexOf("CART") === 0) {
        console.log("dbg step cart")
        const responseMsg = cartNavigationRsponse();
        await writeToUserChatMain(userId, responseMsg, "assistant");
        return NextResponse.json({
            replies: [responseMsg],
            action: "CART"
        });
    } else if (finalResponse.indexOf("DELETE_ID__") === 0) {
        console.log("dbg step delete")
        try {
            const responseSplit = finalResponse.split("__");

            const deleteUrl = await deleteUserCartApi(responseSplit[1]);
            await fetch(deleteUrl, {
                method: 'DELETE',
                headers: { Cookie: cookieStore.toString() },
            });

            const responseMsg = removeCartResponse();
            await writeToUserChatMain(userId, responseMsg, "assistant");
            return NextResponse.json({
                replies: [responseMsg],
                action: "CART_FULL_REFRESH"
            });
        } catch (e) {
            console.error("error ", e)
            const responseMsg = welcomeResponse();
            return NextResponse.json({ replies: [responseMsg] });
        }
    } else if (finalResponse.indexOf("AI_RESPONSE_BAD") === 0) {
        console.log("dbg step ai_response_bad")
        const badQuestResponse = badQuestionResponse();
        await writeToUserChatMain(userId, badQuestResponse, "assistant");

        const responseMsg = welcomeResponse();
        await writeToUserChatMain(userId, responseMsg, "assistant");

        return NextResponse.json({ replies: [badQuestResponse, responseMsg] });
    } else if (finalResponse.indexOf("AI_RESPONSE_") === 0) {
        console.log("dbg step ai_response_")
        const split = finalResponse.split("AI_RESPONSE_");
        if (split.length > 1) {
            const aiResponse = split[1];
            await writeToUserChatMain(userId, aiResponse, "assistant");
            return NextResponse.json({ replies: [aiResponse] });
        } else {
            const badQuestResponse = badQuestionResponse();
            await writeToUserChatMain(userId, badQuestResponse, "assistant");

            const responseMsg = welcomeResponse();
            await writeToUserChatMain(userId, responseMsg, "assistant");

            return NextResponse.json({ replies: [badQuestResponse, responseMsg] });
        }
    } else if (finalResponse.indexOf("AI_TASKS") === 0) {
        console.log("dbg ai_tasks")
        const responses = [
            "Hi i able to do following task",
            "1. Move between menu & cart page only.",
            "2. Delete food from your cart.",
            "3. Adding food to your cart.",
            "4. Asking your random questions.",
        ];
        responses.forEach(r => {
            writeToUserChatMain(userId, r, "assistant");
        })
        return NextResponse.json({ action: "AI_TASKS", replies: responses });
    } else if (finalResponse.indexOf("FOOD_") === 0) {
        console.log("dbg step food_ ", finalResponse)

        if (finalResponse.indexOf("FOOD_UNKNOWN") === 0) {
            const reply = unknownFoodResponse(finalResponse.split("FOOD_UNKNOWN_")[1]);
            await writeToUserChatMain(userId, reply, "assistant");
            return NextResponse.json({ replies: [reply] });
        } else if (finalResponse.indexOf("FOOD_") === 0) {
            const strSplit = finalResponse.split("FOOD_INPUT_")[1].split("_");
            const foodId = strSplit[0];
            const foodNumber = strSplit[1];
            const foodName = strSplit[2];

            const reply = validFoodResponse(foodName);
            await writeToUserChatMain(userId, reply, "assistant");

            return NextResponse.json({ replies: [reply], action: "CART" });
        } else {
            const badQuestResponse = badQuestionResponse();
            await writeToUserChatMain(userId, badQuestResponse, "assistant");

            const responseMsg = welcomeResponse();
            await writeToUserChatMain(userId, responseMsg, "assistant");

            return NextResponse.json({ replies: [badQuestResponse, responseMsg] });
        }
    } else {
        console.log("dbg step else")
        const badQuestResponse = badQuestionResponse();
        await writeToUserChatMain(userId, badQuestResponse, "assistant");

        const responseMsg = welcomeResponse();
        await writeToUserChatMain(userId, responseMsg, "assistant");

        return NextResponse.json({ replies: [badQuestResponse, responseMsg] });
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

const getDataFromApi = async function(api: string, cookieStore: ReadonlyRequestCookies) {
    try {
        const response = await fetch(api, {
            headers: { Cookie: cookieStore.toString() },
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