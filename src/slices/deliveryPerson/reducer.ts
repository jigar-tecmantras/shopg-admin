import {createSlice} from '@reduxjs/toolkit';

export const initialState = {
  data: [],
  loading: false,
};

const DeliveryPersonSlice = createSlice({
  name: 'deliveryPerson',
  initialState,
  reducers: {
    setDeliveryPersonList(state, action) {
      state.data = action.payload;
      state.loading = false;
    },
  },
});

export const {setDeliveryPersonList} = DeliveryPersonSlice.actions;

export default DeliveryPersonSlice.reducer;
