import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const DEFAULT_TOTALCART_APPSLICE = -1;

export interface AppStateInterface {
  totalCart: number;
}

const initialState: AppStateInterface = {
  totalCart: DEFAULT_TOTALCART_APPSLICE,
};

export const appSlice = createSlice({
  name: "total-cart",
  initialState,
  reducers: {
    setTotalCart: (state, action: PayloadAction<number>) => {
      state.totalCart = action.payload;
    },
  },
});

export const { setTotalCart } = appSlice.actions;
export const appReducer = appSlice.reducer;
export const getTotalCart = () => {
  return appSlice.getInitialState().totalCart;
}
