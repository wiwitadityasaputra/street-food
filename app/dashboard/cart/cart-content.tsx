"use client";

export interface CartContentProps {
    data: string;
}

export function CartContent(props: CartContentProps) {

    return (<>
        <div className="cart">{props.data}</div>
    </>)
}