import {createSlice} from '@reduxjs/toolkit';

export const initialState = {
  statusValue: '',
  setProductids: [],
};

const statusChangeSlice = createSlice({
  name: 'ChangeStatus',
  initialState,
  reducers: {
    setStatusValue(state, action) {
      state.statusValue = action.payload;
    },
    setProductIds(state, action) {
      state.setProductids = action.payload;
    },
    setFlushState(state) {
      state.statusValue = '';
      state.setProductids = [];
    },
  },
});

export const {setStatusValue, setProductIds, setFlushState} =
  statusChangeSlice.actions;

export default statusChangeSlice.reducer;
