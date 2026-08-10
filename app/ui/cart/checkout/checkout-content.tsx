"use client";

import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "@/app/ui/cart/checkout/checkout.css"
import { CheckoutContentProps, CheckoutContentState } from "@/app/ui/cart/checkout/checkout.definition";
import { formatCurrency } from "@/app/lib/util/utils";
import { processCarts } from "@/app/lib/form-action/cart.action";
import { DEFAULT_SUCCESS_MESSAGE } from '@/app/lib/form-action/form-action.definition';
import { useAppDispatch } from "@/app/lib/util/redux-provider";
import { setTotalCart } from "@/app/lib/util/redux-provider/app-slice";
import { getRandomCity, getRandomEmail, getRandomFirstname, getRandomInfo, getRandomLastname, getRandomPhonenumber, getRandomSecondaryAddress, getRandomState, getRandomStreetAddress, getRandomZipcode } from '@/app/lib/util/fake-input.util';

export default function CheckoutContent(props: CheckoutContentProps) {
    const { replace } = useRouter();
    const dispatch = useAppDispatch();

    let subTotal = 0;
    let total = 0;
    props.carts.forEach(c => {
        subTotal += c.finalPrice;
    });
    total = subTotal;

    const [state, formAction, pending] = React.useActionState(processCarts, {});
    const [checkoutContentState, setCheckoutContentState] = React.useState(CheckoutContentState.INIT);
    const [time, setTime] = React.useState(10);

    React.useEffect(() => {
        let timeId: NodeJS.Timeout;
        let t: number;

        if (state.successMessage === DEFAULT_SUCCESS_MESSAGE ) {
            setCheckoutContentState(CheckoutContentState.SUCCESS_CHECKOUT);
            dispatch(setTotalCart(0));
            timeId = setTimeout(() => {
                replace("/queue/me");
            }, 11000);

            t = window.setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        }

        return () => {
            if (timeId) {
                window.clearTimeout(timeId)
            }
            if (t) {
                window.clearInterval(t);
            }
        }
    }, [state]);

    const [firstName, setFirstName] = React.useState(getRandomFirstname());
    const [lastName, setLastName] = React.useState(getRandomLastname());
    const [streetAddress, setStreetAddress] = React.useState(getRandomStreetAddress());
    const [secondAddress, setSecondAddress] = React.useState(getRandomSecondaryAddress());
    const [city, setCity] = React.useState(getRandomCity());
    const [stateField, setState] = React.useState(getRandomState());
    const [zipCode, setZipCode] = React.useState(getRandomZipcode());
    const [phoneNumber, setPhoneNumber] = React.useState(props.phoneNumber);
    const [emailAddress, setEmailAddress] = React.useState(props.emailAddress);
    const [additionalInfo, setAdditionalInfo] = React.useState(getRandomInfo());

    const refreshAddress = () => {
        console.log("dbg refresh")
        setFirstName(getRandomFirstname());
        setLastName(getRandomLastname());
        setStreetAddress(getRandomStreetAddress());
        setSecondAddress(getRandomSecondaryAddress());
        setCity(getRandomCity());
        setState(getRandomState());
        setZipCode(getRandomZipcode());
        setPhoneNumber(getRandomPhonenumber());
        setEmailAddress(getRandomEmail());
        setAdditionalInfo(getRandomInfo());
    }

    return (<>
        <form action={formAction}
            className={clsx({"checkout-hide": checkoutContentState === CheckoutContentState.SUCCESS_CHECKOUT})}>
            <div className="checkout">
                <section className="cart_view mt_100 xs_mt_70 mb_100 xs_mb_70">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-8 col-lg-7">
                                <div className="checkout_form">
                                    <div className="check_form">
                                        <div className="row mt_30">
                                            <div className="col-12">
                                                <h5 className="billing-address-title">
                                                    billing address
                                                    <span className="refresh-address-btn">
                                                        <FontAwesomeIcon icon={faArrowRotateLeft} size="sm" 
                                                            onClick={refreshAddress}/>
                                                    </span>
                                                </h5>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>First Name</h6>
                                                    <input type="text" placeholder="First Name" 
                                                        name="firstName"
                                                        defaultValue={firstName}
                                                        disabled={pending} />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>Last Name</h6>
                                                    <input type="text" placeholder="Last Name" 
                                                        name="lastName"
                                                        defaultValue={lastName}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-lg-12 col-xl-12">
                                                <div className="check_single_form">
                                                    <h6>Street Address</h6>
                                                    <input type="text" placeholder="Street Address *"
                                                        name="streetAddress"
                                                        defaultValue={streetAddress}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>Second Address</h6>
                                                    <input type="text" placeholder="Apartment, suite, unit, etc. (optional)"
                                                        name="secondAddress"
                                                        defaultValue={secondAddress}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>City</h6>
                                                    <input type="text" placeholder="Town / City *"
                                                        name="city"
                                                        defaultValue={city}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>State</h6>
                                                    <input type="text" placeholder="State *"
                                                        name="state"
                                                        defaultValue={stateField}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>Zip Code</h6>
                                                    <input type="text" placeholder="Zip *"
                                                        name="zipCode"
                                                        defaultValue={zipCode}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>Phone Number</h6>
                                                    <input type="text" placeholder="Phone *"
                                                        name="phoneNumber"
                                                        defaultValue={phoneNumber}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-12 col-xl-6">
                                                <div className="check_single_form">
                                                    <h6>Email Address</h6>
                                                    <input type="email" placeholder="Email *"
                                                        name="emailAddress"
                                                        defaultValue={emailAddress}
                                                        disabled={pending}/>
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-lg-12 col-xl-12">
                                                <div className="check_single_form mt_30 mb-0">
                                                    <h5>Additional Information</h5>
                                                    <textarea cols={3} rows={4}
                                                        placeholder="Notes about your order, e.g. special notes for delivery"
                                                        defaultValue={additionalInfo}
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
                                            <input type="hidden" name="userId" value={props.userId}></input>
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
        <div className={clsx("checkout", {"checkout-hide": checkoutContentState === CheckoutContentState.INIT})}>
            <section className="cart_view mt_100 xs_mt_70 mb_100 xs_mb_70">
                <div className="container">
                    <div className="row">
                        <div className="section_heading">
                            <h4>Success Checkout</h4>
                            <h5>Thank you for using our services.</h5>
                            <p className="success-checkout-info">
                                We still processing your request, please check <strong>{emailAddress}</strong> or 
                                <strong> {phoneNumber}</strong> regularly.
                            </p>
                            <p className="success-checkout-info">
                                We will send your order information there.
                            </p>
                            <p className="success-checkout-info">
                                You can also visit <strong>/queue</strong> page to check other orders, we will redirect you in {time} second.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>)
}