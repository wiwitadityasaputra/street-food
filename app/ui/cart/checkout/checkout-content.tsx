"use client";
import { useActionState, useEffect } from 'react';

import "@/app/ui/cart/checkout/checkout.css"
import { CheckoutContentProps } from "./checkout.definition";
import { formatCurrency } from "@/app/lib/util/utils";
import { processCarts } from "@/app/lib/form-action/cart.action";
import { DEFAULT_SUCCESS_MESSAGE } from '@/app/lib/form-action/form-action.definition';

export default function CheckoutContent(props: CheckoutContentProps) {
    let subTotal = 0;
    let total = 0;
    props.carts.forEach(c => {
        subTotal += c.finalPrice;
    });
    total = subTotal;

    const [state, formAction, pending] = useActionState(processCarts, {erroMessage: ''});
    useEffect(() => {
        if (state.successMessage === DEFAULT_SUCCESS_MESSAGE ) {
            // replace("/queue");
        }
    }, [state.successMessage]);

    return (<>
        <form action={formAction}>
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
                                                        name="firstName"
                                                        defaultValue={props.firstName} 
                                                        disabled={pending} />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>Last Name</h6>
                                                    <input type="text" placeholder="Last Name" 
                                                        name="lastName"
                                                        defaultValue={props.lastName}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-lg-12 col-xl-12">
                                                <div className="check_single_form">
                                                    <h6>Street Address</h6>
                                                    <input type="text" placeholder="Street Address *"
                                                        name="streetAddress"
                                                        defaultValue={props.streetAddress}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>Second Address</h6>
                                                    <input type="text" placeholder="Apartment, suite, unit, etc. (optional)"
                                                        name="secondAddress"
                                                        defaultValue={props.secondAddress}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>City</h6>
                                                    <input type="text" placeholder="Town / City *"
                                                        name="city"
                                                        defaultValue={props.city}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>State</h6>
                                                    <input type="text" placeholder="State *"
                                                        name="state"
                                                        defaultValue={props.state}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>Zip Code</h6>
                                                    <input type="text" placeholder="Zip *"
                                                        name="zipCode"
                                                        defaultValue={props.zipCode}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>Phone Number</h6>
                                                    <input type="text" placeholder="Phone *"
                                                        name="phoneNumber"
                                                        defaultValue={props.phoneNumber}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>Email Address</h6>
                                                    <input type="email" placeholder="Email *"
                                                        name="emailAddress"
                                                        defaultValue={props.emailAddress}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-lg-12 col-xl-12">
                                                <div className="check_single_form mt_30 mb-0">
                                                    <h5>Additional Information</h5>
                                                    <textarea cols={3} rows={4}
                                                        placeholder="Notes about your order, e.g. special notes for delivery"
                                                        defaultValue={props.additionalInfo}
                                                        disabled={pending}>
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
                                        <div>
                                            <h6>total cart ({props.carts.length})</h6>
                                            <p>subtotal: <span>{formatCurrency(subTotal)}</span></p>
                                            <p>delivery: <span>$00.00</span></p>
                                            <p>discount: <span>$0.00</span></p>
                                            <p className="total"><span>total:</span> <span>{formatCurrency(total)}</span></p>
                                        </div>
                                        <div className="process">
                                            <button type="submit" disabled={pending}>
                                                Process
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    </>)
}