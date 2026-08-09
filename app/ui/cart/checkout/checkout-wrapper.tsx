"use server";

import { redirect } from 'next/navigation';

import { getUserCarts } from "@/app/lib/service/cart.service";
import { UserCartResponse } from "@/app/lib/service/service.definition";
import { cookiesGetUserId } from "@/app/lib/util/cookie-util";
import CheckoutContent from "./checkout-content";
import {
    getRandomCity,
    getRandomEmail,
    getRandomFirstname,
    getRandomInfo,
    getRandomLastname,
    getRandomPhonenumber,
    getRandomSecondaryAddress,
    getRandomState,
    getRandomStreetAddress,
    getRandomZipcode
} from "@/app/lib/util/fake-input.util";

export async function CheckoutWrapper() {
    
    const userId = await cookiesGetUserId();
    if (userId) {
        const carts: UserCartResponse[] = await getUserCarts(userId);
        if (!carts || carts.length === 0) {
            redirect(`/menu`);
        } else {
            const firstName = getRandomFirstname();
            const lastName = getRandomLastname();
            const streetAddress = getRandomStreetAddress();
            const secondAddress = getRandomSecondaryAddress();
            const city = getRandomCity();
            const state = getRandomState();
            const zipCode = getRandomZipcode();
            const phoneNumber = getRandomPhonenumber();
            const emailAddress = getRandomEmail();
            const additionalInfo = getRandomInfo();
            return (<>
                <CheckoutContent
                    carts={carts}
                    firstName={firstName}
                    lastName={lastName}
                    streetAddress={streetAddress}
                    secondAddress={secondAddress}
                    city={city}
                    state={state}
                    zipCode={zipCode}
                    phoneNumber={phoneNumber}
                    emailAddress={emailAddress}
                    additionalInfo={additionalInfo}
                />
            </>)
        }
    } else {
        redirect(`/menu`);
    }
}