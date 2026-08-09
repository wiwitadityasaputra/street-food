"use client";

import React from "react";

import { useAppSelector } from "@/app/lib/util/redux-provider";
import { DEFAULT_TOTALCART_APPSLICE } from "@/app/lib/util/redux-provider/app-slice";


export interface TotalCartProps {
  totalCartInit: number;
  menuName: string;
}

const TotalCart = (props: TotalCartProps) => {
  const totalCart = useAppSelector((state) => state.app.totalCart);
  let [finalCart, setFinalCart] = React.useState(props.totalCartInit);

  React.useEffect(() => {
    if (totalCart != DEFAULT_TOTALCART_APPSLICE) {
      setFinalCart(totalCart);
    }
  }, [totalCart]); 

  return (<>{props.menuName} ({finalCart})</>);
};

export default TotalCart;
