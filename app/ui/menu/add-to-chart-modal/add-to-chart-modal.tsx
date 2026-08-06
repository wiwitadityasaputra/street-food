"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

import "@/app/ui/menu/add-to-chart-modal/add-to-chart-modal.css"
import { Cuisines, CuisinesChart } from "@/app/lib/definition";
import CuisineRating from "@/app/ui/menu/cusine-rating/cuisine-rating";
import { formatCurrency } from '@/app/lib/utils';
import { addToChart } from '@/app/lib/actions';

export interface AddToChartModalProps {
    cuisine: Cuisines;
    cuisineCarts: CuisinesChart[];
}

export interface AddToChartOptionsDetail {
    id: number;
    name: string;
    price: number;
    checked: boolean;
}

export interface AddToChartOptions {
    name: string;
    mandatory: boolean;
    detail: AddToChartOptionsDetail[];
    latestPriceIncrease: number;
}

export interface CheckboxOptionsState {
    name: string;
    price: number;
}

export default function AddToChartModal(props: AddToChartModalProps) {
    const router = useRouter();

    const compareCuisineCart = (a: CuisinesChart, b: CuisinesChart) => {
        return a.order - b.order;
    }
    const cuisineCarts = props.cuisineCarts.sort(compareCuisineCart);

    const checkboxOptions: CheckboxOptionsState[] = [];
    const options: AddToChartOptions[] = [];
    cuisineCarts.forEach((c) => {
        const finded = options.find((o) => {
            return o.name.toLowerCase() === c.group.toLowerCase();
        });
        if (!finded) {
            options.push({
                name: c.group,
                mandatory: c.cartType === "radio",
                detail: [{
                    id: c.id,
                    name: c.name,
                    price: c.price,
                    checked: c.price === 0
                }],
                latestPriceIncrease: 0
            });
        } else {
            finded.detail.push({
                id: c.id,
                name: c.name,
                price: c.price,
                checked: false
            })
        }

        if (c.cartType === "checkbox") {
            checkboxOptions.push({
                name: c.name,
                price: c.price
            })
        }
    });

    const compareDetail = (a: AddToChartOptionsDetail, b: AddToChartOptionsDetail) => {
        return a.price - b.price;
    }
    options.forEach(o => {
        o.detail = o.detail.sort(compareDetail);
    })

    const radioOnChange = (o: AddToChartOptions, d: AddToChartOptionsDetail) => {
        let minus = 0;
        radioState.find(opt => {
            const finded = opt.name === o.name;
            minus = opt.latestPriceIncrease;
            return finded;
        });

        radioState.find((opt) => {
            const finded = opt.name === o.name;
            if (finded) {
                opt.latestPriceIncrease = d.price;
                const price = pricePerItem + d.price - minus
                setPricePerItem(price);
                setFinalPrice(quantity * price);
            }
            return finded;
        });
        setRadioState(radioState);
    }

    const checkboxOnChange = (d: AddToChartOptionsDetail) => {
        checkboxState.find(c => {
            const finded = c.name === d.name;
            if (finded) {
                const price = pricePerItem + c.price;
                setPricePerItem(price);
                setFinalPrice(quantity * price);
                if (c.price > 0) {
                    c.price = -Math.abs(c.price);
                } else {
                    c.price = Math.abs(c.price);
                }
            }
            return finded;
        })
        setCheckboxState(checkboxState);
    }

    const multipleOrder = (order: number) => {
        const finalQuantity = quantity + order;
        if (finalQuantity >= 1) {
            setQuantity(finalQuantity);
            setFinalPrice(finalQuantity * pricePerItem);
        }
    }

    let [pricePerItem, setPricePerItem] = React.useState(props.cuisine.price);
    let [finalPrice, setFinalPrice] = React.useState(props.cuisine.price);
    let [quantity, setQuantity] = React.useState(1);
    let [radioState, setRadioState] = React.useState(options);
    let [checkboxState, setCheckboxState] = React.useState(checkboxOptions);
    
    const addToChartAction = addToChart.bind(null);

    return (<>
        <div className="add-to-chart-modal modal show cart_popup">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button onClick={router.back} type="button" className="btn-close">
                            <FontAwesomeIcon icon={faClose} size="sm" />
                        </button>
                        <div className="cart_popup_img">
                            <Image
                                src={`/images/cuisine/${props.cuisine.id}/1.jpg`}
                                width={344}
                                height={220}
                                alt={"cuisine.name"}
                                unoptimized
                            />
                        </div>
                        <form action={addToChartAction}>
                            <div className="cart_popup_text">
                                <a href="#" className="title">
                                    {props.cuisine.name}
                                </a>
                                <p className="rating">
                                    <CuisineRating rate={props.cuisine.rate} />                               
                                    <span>({props.cuisine.review})</span>
                                </p>
                                <h4 className="price">
                                    Price per item: {formatCurrency(props.cuisine.price)}
                                </h4>
                                {options.map((o) => {
                                    return <div key={o.name} className="details_size">
                                        <h5>{o.name} {!o.mandatory && <span>(optional)</span>}</h5>
                                        {o.detail.map((d) => {
                                            let name = "checkbox-" + d.id;
                                            let value: any = d.id;
                                            if (o.mandatory) {
                                                name = "radio-" + o.name;
                                                value = d.id;
                                            }
                                            return <div key={d.name} className="form-check">
                                                <input 
                                                    type={o.mandatory ? "radio" : "checkbox"}
                                                    className="form-check-input"
                                                    name={name}
                                                    defaultChecked={d.checked}
                                                    value={value}
                                                    onChange={() => {
                                                        if (o.mandatory) {
                                                            radioOnChange(o, d)
                                                        } else {
                                                            checkboxOnChange(d);
                                                        }
                                                    }}/>
                                                <label className="form-check-label add-to-chart-detail-price">
                                                    {d.name} <span>+ {formatCurrency(d.price)}</span>
                                                </label>
                                            </div>;
                                        })}
                                    </div>;
                                })}

                                <div className="details_quentity">
                                    <h5>select quanitty</h5>
                                    <div className="quentity_btn_area d-flex flex-wrapa align-items-center">
                                        <div className="quentity_btn">
                                            <button type="button" className="btn btn-danger" onClick={() => {multipleOrder(-1)}}>
                                                <FontAwesomeIcon icon={faMinus} size="sm" />
                                            </button>
                                            <input type="text" name="quantity" value={quantity} placeholder={String(quantity)} disabled></input>
                                            <button type="button" className="btn btn-success" onClick={() => {multipleOrder(1)}}>
                                                <FontAwesomeIcon icon={faPlus} size="sm" />
                                            </button>
                                        </div>
                                        <h3>{formatCurrency(finalPrice)}</h3>
                                    </div>
                                </div>
                                <ul className="details_button_area d-flex flex-wrap">
                                    <li>
                                        <input type="hidden" name="pricePerItem" value={pricePerItem}></input>
                                        <input type="hidden" name="quantity" value={quantity}></input>
                                        <input type="hidden" name="finalPrice" value={finalPrice}></input>
                                        <button className="common_btn" type="submit">
                                            add to cart
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>);
}