export const editCartResponse = () => {
    const list = [
        "All set! Your order changes are saved.",
        "Got it! Your cart has been updated.",
        "Cart updated! Ready whenever you are.",
        "Sweet! Your cart is looking good to go.",
        "Changes saved! Your cart has been updated.",
        "Done! We've updated your delicious selections."
    ];
    return list[Math.floor(Math.random() * list.length)];
}

export const cartNavigationRsponse = () => {
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

export const menuNavigationResponse = () => {
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

export const emptyCartResponse = () => {
    const list = [
        "Your cart is empty, please add food first!",
        "Your cart is looking a little lonely! Add some delicious food to get started.",
        "No items in your cart yet. Add some food to proceed!",
        "Your food cart is empty! Let's fill it up with something tasty.",
        "Cart is empty. Please add items to continue."
    ];
    return list[Math.floor(Math.random() * list.length)];
}

export const removeCartResponse = () => {
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

export const welcomeResponse = () => {
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

export const badQuestionResponse = () => {
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

export const unknownFoodResponse = (food: string) => {
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

export const unknownFoodDescriptionResponse = () => {
    const list = [
        "I'm sorry, we don't have that kind of food",
        "I'm sorry, we don't carry those items",
        "I'm sorry, we don't have that kind of food on our menu",
        "Sorry, that's not on our menu",
        "Unfortunately, we don't carry that type of food",
        "We wish we had that!, my apologize"
    ];
    return list[Math.floor(Math.random() * list.length)];
}

export const validFoodResponse = (food: string) => {
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

export const multipleItemsToBeDeletedResponse = (food: string) => {
    const f = food.charAt(0).toUpperCase() + food.slice(1);
    const list = [
        `You have multiple ${f}, which one should i remove?`,
        `Looks like you have a few ${f} in your cart! Which one would you like to drop?`,
        `Multiple ${f} detected. Which one should we remove?`,
        `Select a ${f} to remove from your cart?`,
        `Multiple ${f} found. Specify which one to remove?`
    ];
    return list[Math.floor(Math.random() * list.length)];
}