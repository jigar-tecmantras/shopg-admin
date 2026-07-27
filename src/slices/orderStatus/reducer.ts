import {createSlice} from '@reduxjs/toolkit';

export const initialState = {
  data: [],
  status: false,
  loading: false,
};

const OrderStatusSlice = createSlice({
  name: 'orderstatus',
  initialState,
  reducers: {
    setOrderStatusforCard(state, action) {
      state.status = action.payload;
      state.loading = false;
    },
    setOrderStatusData(state, action) {
      state.data = action.payload;
      state.loading = false;
    },
  },
});

export const {setOrderStatusforCard, setOrderStatusData} =
  OrderStatusSlice.actions;

export default OrderStatusSlice.reducer;
