"use client";

import "@/app/ui/cart/checkout/checkout.css"
import { CheckoutContentProps } from "./checkout.definition";
import { formatCurrency } from "@/app/lib/util/utils";
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

export default function CheckoutContent(props: CheckoutContentProps) {
    let subTotal = 0;
    let total = 0;
    props.carts.forEach(c => {
        subTotal += c.finalPrice;
    });
    total = subTotal;

    let firstName = getRandomFirstname();
    let lastName = getRandomLastname();
    let streetAddress = getRandomStreetAddress();
    let secondAddress = getRandomSecondaryAddress();
    let city = getRandomCity();
    let state = getRandomState();
    let zipCode = getRandomZipcode();
    let phoneNumber = getRandomPhonenumber();
    let emailAddress = getRandomEmail();
    let additionalInfo = getRandomInfo();

    return (<>
        <div className="checkout">
            <section className="cart_view mt_100 xs_mt_70 mb_100 xs_mb_70">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 col-lg-7">
                            <div className="checkout_form">
                                <div className="check_form">
                                    <div className="row mt_30">
                                        <div className="col-12">
                                            <h5>billing address</h5>
                                        </div>
                                        <div className="col-md-6 col-lg-12 col-xl-6">
                                            <div className="check_single_form">
                                                <h6>First Name</h6>
                                                <input type="text" placeholder="First Name" 
                                                    name="firstName" defaultValue={firstName} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-12 col-xl-6">
                                            <div className="check_single_form">
                                                <h6>Last Name</h6>
                                                <input type="text" placeholder="Last Name" 
                                                    name="lastName" defaultValue={lastName} />
                                            </div>
                                        </div>
                                        <div className="col-md-12 col-lg-12 col-xl-12">
                                            <div className="check_single_form">
                                                <h6>Street Address</h6>
                                                <input type="text" placeholder="Street Address *"
                                                    name="streetAddress" defaultValue={streetAddress} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-12 col-xl-6">
                                            <div className="check_single_form">
                                                <h6>Second Address</h6>
                                                <input type="text" placeholder="Apartment, suite, unit, etc. (optional)"
                                                    name="secondAddress" defaultValue={secondAddress} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-12 col-xl-6">
                                            <div className="check_single_form">
                                                <h6>City</h6>
                                                <input type="text" placeholder="Town / City *"
                                                    name="city" defaultValue={city} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-12 col-xl-6">
                                            <div className="check_single_form">
                                                <h6>State</h6>
                                                <input type="text" placeholder="State *"
                                                    name="state" defaultValue={state} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-12 col-xl-6">
                                            <div className="check_single_form">
                                                <h6>Zip Code</h6>
                                                <input type="text" placeholder="Zip *"
                                                    name="zipCode" defaultValue={zipCode} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-12 col-xl-6">
                                            <div className="check_single_form">
                                                <h6>Phone Number</h6>
                                                <input type="text" placeholder="Phone *"
                                                    name="phoneNumber" defaultValue={phoneNumber} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-12 col-xl-6">
                                            <div className="check_single_form">
                                                <h6>Email Address</h6>
                                                <input type="email" placeholder="Email *"
                                                    name="emailAddress" defaultValue={emailAddress} />
                                            </div>
                                        </div>
                                        <div className="col-md-12 col-lg-12 col-xl-12">
                                            <div className="check_single_form mt_30 mb-0">
                                                <h5>Additional Information</h5>
                                                <textarea cols={3} rows={4}
                                                    placeholder="Notes about your order, e.g. special notes for delivery"
                                                    defaultValue={additionalInfo}>
                                                </textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-5 cost-info">
                            <div className="cart_list_footer_button sticky-sidebar">
                                <div className="cart_list_footer_button_text">
                                    <h6>total cart ({props.carts.length})</h6>
                                    <p>subtotal: <span>{formatCurrency(subTotal)}</span></p>
                                    <p>delivery: <span>$00.00</span></p>
                                    <p>discount: <span>$0.00</span></p>
                                    <p className="total"><span>total:</span> <span>{formatCurrency(total)}</span></p>
                                    <a className="common_btn" href="payment.html">Pay</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>)
}