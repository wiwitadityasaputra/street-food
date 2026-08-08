"use client";

import Image from "next/image";

import "@/app/ui/cart/cart.css";
import { UserCartResponse } from "@/app/lib/definition";
import { formatCurrency } from "@/app/lib/utils";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface CartContnetProps {
    carts: UserCartResponse[]
}

export function CartContent(props: CartContnetProps) {
    const cartItems = props.carts;
    if (cartItems.length === 0) {
        return (<div className="cart">Empty Cart, please choose cuisine first.</div>);
    }
	let finalPrice = 0;
	cartItems.forEach(c => {
		finalPrice += c.finalPrice;
	});

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
													<tr key={c.cuisineId}>
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
															<FontAwesomeIcon icon={faTimes} size="lg" className="action-remove" />
														</td>
													</tr>
												)
											})}
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
                                            <h6>total cart ({cartItems.length})</h6>
                                            <p className="total">
												<span>total:</span> <span>{formatCurrency(finalPrice)}</span>
											</p>
                                            <form>
                                                <button type="submit">apply</button>
                                            </form>
                                            <a className="common_btn" href="check_out.html">checkout</a>
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