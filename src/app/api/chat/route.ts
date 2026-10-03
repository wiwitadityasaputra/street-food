import { NextResponse } from "next/server";
import { deepSeek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';
import { cookies, headers } from "next/headers";

import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { writeToUserChatMain } from "@/src/lib/database/database";

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

    let cartData = [];
    try {
        const response = await fetch(await getUserCarts(), {
            headers: { Cookie: cookieStore.toString() },
        });
        cartData = await response.json();
    } catch (e) {
        console.error("Failed to fetch cart:", e);
    }

    const result = await generateText({
        model: deepSeek('deepseek-flash'),
        system: `
            You are an intelligent assistant for a street-food e-commerce application. 
            The application currently consists of only two pages:
            1. Menu
            2. Cart

            You have some sequential tasks todo
            
            ### Task No 1: To analyze the user's current page context and their latest input, intent, or action, 
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

            Result for Task No 1 is ONLY with one of the two exact navigation commands: MENU or CART
            from Task No 1 result, if MENU or CART then skip there
            no need to continue to next tasks
            or when you can't decided the Task No 1 result, you can coninue to Task No 2 below

            ### Task No 2: Cart Deletion
            If the user wants to remove a specific food, match their requested food name against the user's current cart data provided below.

            - If a matching food is found, output exactly:
            DELETE_ID__{userCartId}

            If no food is specified for deletion, output exactly:
            DELETE_NO

            Current User Cart Data: ${JSON.stringify(cartData)}
        `,
        prompt: "[current-page='" + lastPath + "']" + message
    });

    const finalResponse = await result.text;
    if (finalResponse.indexOf("MENU") === 0) {
        const responseMsg = menuNavigationResponse();
        await writeToUserChatMain(userId, responseMsg, "assistant");
        return NextResponse.json({
            reply: responseMsg,
            action: "MENU"
        });
    } else if (finalResponse.indexOf("CART") === 0) {
        const responseMsg = cartNavigationRsponse();
        await writeToUserChatMain(userId, responseMsg, "assistant");
        return NextResponse.json({
            reply: responseMsg,
            action: "CART"
        });
    } else if (finalResponse.indexOf("DELETE_ID__") === 0) {
        try {
            const responseSplit = finalResponse.split("__");

            const deleteUrl = await deleteUserCartByUserCartId(responseSplit[1]);
            await fetch(deleteUrl, {
                method: 'DELETE',
                headers: { Cookie: cookieStore.toString() },
            });
            const responseMsg = removeCartResponse();

            await writeToUserChatMain(userId, responseMsg, "assistant");
            return NextResponse.json({
                reply: responseMsg,
                action: "CART_FULL_REFRESH"
            });
        } catch (e) {
            console.error("error ", e)
            return NextResponse.json({ reply: "Hi there! How can we help you today?" });
        }
    } else {
        return NextResponse.json({ reply: "Hi there! How can we help you today?" });
    }
}

const getUserCarts = async function() {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const cartApi = `${protocol}://${host}/api/cart`;
    return cartApi;
}

const deleteUserCartByUserCartId = async function(userCartId: string) {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const cartApi = `${protocol}://${host}/api/cart/${userCartId}`;
    return cartApi;
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