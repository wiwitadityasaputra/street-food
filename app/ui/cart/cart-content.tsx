"use client";

import Image from "next/image";
import { useRouter } from 'next/navigation';

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "@/app/ui/cart/cart.css";
import { formatCurrency } from "@/app/lib/util/utils";
import { CartContentProps } from "@/app/ui/cart/cart-content.definition";
import { deleteCartItemAction } from "@/app/lib/form-action/cart.action";
import Link from "next/link";

export function CartContent(props: CartContentProps) {
    const { replace } = useRouter();
    const cartItems = props.carts;
    if (cartItems.length === 0) {
        return (<div className="cart">
            Empty Cart, please choose cuisine first.
        </div>);
    }
	let finalPrice = 0;
	cartItems.forEach(c => {
		finalPrice += c.finalPrice;
	});

    const addMoreClicked = () => {
        replace("/menu");
    }

    const formAction = deleteCartItemAction.bind(null);

    return (<>
        <div className="cart">
            <section className="cart_view mt_100 xs_mt_70 mb_100 xs_mb_70">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 wow fadeInUp" data-wow-duration="1s">
                            <div className="cart_list">
                                <div className="table-responsive">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th className="pro_img">Image</th>
                                                <th className="pro_name">details</th>
                                                <th className="pro_status">price</th>
                                                <th className="pro_select">quantity</th>
                                                <th className="pro_tk">total</th>
                                                <th className="pro_icon">
                                                    Action
                                                </th>
                                            </tr>
											{cartItems.map(c => {
												return (
													<tr key={c.userCartId}>
														<td className="pro_img item-image">
															<Image
																src={`/images/cuisine/${c.cuisineId}/1.jpg`}
																width={30}
																height={35}
																alt={"cuisine.name"}
																unoptimized />
														</td>
														<td className="pro_name">
															<p className="item-name">{c.cuisineName}</p>
															{c.options.map(o => {
																return (<p key={o}>{o}</p>)
															})}
														</td>
														<td className="pro_status">
															<h6>{formatCurrency(c.pricePerItem)}</h6>
														</td>
														<td className="pro_select">
															<div className="quentity_btn">
																<input type="text" placeholder="item" disabled value={c.quantity}/>
															</div>
														</td>
														<td className="pro_tk">
															<h6>{formatCurrency(c.finalPrice)}</h6>
														</td>
														<td className="pro_icon">
                                                            <form action={formAction}>
                                                                <input type="hidden" name="userId" value={props.userId}></input>
                                                                <input type="hidden" name="userCartId" value={c.userCartId}></input>
                                                                <button type="submit">
                                                                    <FontAwesomeIcon
                                                                        icon={faTimes}
                                                                        size="lg"
                                                                        className="action-remove"
                                                                    />
                                                                </button>
                                                            </form>
														</td>
													</tr>
												)
											})}
                                            <tr>
                                                <td style={{width: "100%", textAlign: "left"}}>
                                                    <div style={{width: "100%", textAlign: "left"}}>
                                                        <button type="button" className="btn btn-success add-more-btn"
                                                            onClick={addMoreClicked}>
                                                            Add More
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 wow fadeInUp" data-wow-duration="1s">
                            <div className="cart_list_footer_button mt_50">
                                <div className="row">
                                    <div className="col-xl-7 col-md-6">
                                    </div>
                                    <div className="col-xl-5 col-md-6">
                                        <div className="cart_list_footer_button_text">
                                            <h6 className="total-cart-items">total cart ({cartItems.length})</h6>
                                            <p className="total">
												<span>total:</span> <span>{formatCurrency(finalPrice)}</span>
											</p>
                                            <Link className="common_btn" href={"/cart/checkout"}>
                                                Checkout
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>)
}