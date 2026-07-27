import {createSlice} from '@reduxjs/toolkit';

export const initialState = {
  statusValue: '',
  setDeleteProductids: [],
};

const DeleteProductSlice = createSlice({
  name: 'SelectedDeletes',
  initialState,
  reducers: {
    setStatusValue(state, action) {
      state.statusValue = action.payload;
    },
    setDeleteProductIds(state, action) {
      state.setDeleteProductids = action.payload;
    },
    setFlushState(state) {
      state.statusValue = '';
      state.setDeleteProductids = [];
    },
  },
});

export const {setStatusValue, setDeleteProductIds, setFlushState} =
  DeleteProductSlice.actions;

export default DeleteProductSlice.reducer;
