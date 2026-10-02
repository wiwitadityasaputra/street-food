import { NextResponse } from "next/server";
import { deepSeek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';
import { cookies, headers } from "next/headers";
import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { writeToUserChatMain } from "@/src/lib/database/database";

const getCartApi = async function() {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const cartApi = `${protocol}://${host}/api/cart`;
    return cartApi;
}

export async function POST(request: Request) {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json([]);
    }
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
        const cookieStore = await cookies();
        const response = await fetch(await getCartApi(), {
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
            
            Task No 1: To analyze the user's current page context and their latest input, intent, or action, 
            and decide where they should navigate next.

            You must choose strictly one of the following three options:
            - "MENU": Navigate the user to the menu page.
            - "CART": Navigate the user to the cart page.
            - "STAY": Do not navigate; stay on the current page because the intent is unclear or irrelevant to navigation.

            ### Guidelines:
            - If the user expresses a desire to view products, go back, shop, or see the main store, choose "MENU".
            - If the user asks about their items, checkout, total price, or viewing selected products, choose "CART".
            - If the user's request is ambiguous, unrelated to navigation, or requires staying on the current view, choose "STAY".

            ### Examples:
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

            # Core Rules & Constraints
            1. **Strictly evaluate Task No 1.** Look exclusively at the result of Task No 1.
            2. **Conditional Check:** 
            - If the result points to **MENU**, your output must start with MENU-.
            - If the result points to **CART**, your output must start with CART-.
            3. **Short-Circuit Execution:** Stop processing immediately once you determine the result is MENU or CART. Do NOT continue to subsequent tasks.
            4. **Output Format:** You must strictly follow this exact pattern:
            [COMMAND]-[Friendly message welcoming the user to the page]

            # Examples of Expected Output
            - MENU-Welcome back! Dive right into our delicious menu and find your next favorite meal today!
            - MENU-Great to see you again! Explore our mouthwatering menu and discover a new flavor to love today.
            - MENU-Welcome back! Jump right into our delicious offerings and treat yourself to something amazing.
            - MENU-So glad you're back! Take a look at our tasty menu and find your next go-to favorite.
            - MENU-Look who's back! Check out our menu and dive into a meal you'll crave all over again.
            - MENU-Welcome back! Ready for another great bite? Browse our menu and pick something tasty.
            - MENU-Hey there, welcome back! See what's cooking and find your next favorite dish today.
            - MENU-Welcome back! Dive into our delicious menu and find your next crave-worthy meal.
            - MENU-Great to have you back! Explore our menu to discover your next delicious obsession.
            - CART-Almost ready to feast? Review your items in the cart and breeze through checkout when you are set!
            - CART-Hungry yet? Double-check your cravings in the cart and zip right through checkout!
            - CART-Almost chow time! Take one last look at your order and breeze through to checkout.
            - CART-Feast mode: loading... Review your cart and secure your meal in a snap!
            - CART-Ready to eat? Check your cart and breeze through checkout.
            - CART-One last look at your meal before you lock it in!
            - CART-Review your order and speed through checkout when you're ready.
            - CART-Looks like a delicious spread! Take a quick peek at your cart to finalize your order.
            - CART-Almost time to dig in. Review your items and complete your checkout with ease.
            - CART-Everything look good? Breeze through checkout whenever you're ready to order.

            and when you can't decided the Task No 1 result, we can coninue to Task No 2

            ### Task No 2: Cart Deletion
            If the user wants to remove a specific food, match their requested food name against the user's current cart data provided below. 
            Format the output as DELETE_ID-{userCartId} (e.g., DELETE_ID-352).
            If no food is specified for deletion, output DELETE_NO.

            Current User Cart Data: ${JSON.stringify(cartData)}
        `,
        prompt: "[current-page='" + lastPath + "']" + message
    });

    const finalResponse = await result.text;
    console.log("dbg finalResponsee ", finalResponse)
    if (finalResponse.indexOf("MENU-") === 0) {
        const aiMessage = finalResponse.split("MENU-")[1];
        await writeToUserChatMain(userId, aiMessage, "assistant");
        return NextResponse.json({
            reply: aiMessage,
            action: "MENU"
        });
    } else if (finalResponse.indexOf("CART-") === 0) {
        const aiMessage = finalResponse.split("CART-")[1];
        await writeToUserChatMain(userId, aiMessage, "assistant");
        return NextResponse.json({
            reply: aiMessage,
            action: "CART"
        });
    } else if (finalResponse.indexOf("DELETE_ID-") === 0) {
        const DUMMY_REPLY = "Thanks for your message! Our team will be happy to help.";
        return NextResponse.json({ reply: DUMMY_REPLY });
    }
}
