import {createSlice} from '@reduxjs/toolkit';

export const initialState = {
  currentLocation: '',
  nextLocation: '',
  isFormUpdate: false,
};

const currentLocationSlice = createSlice({
  name: 'currentLocation',
  initialState,
  reducers: {
    setCurrentLocation(state, action) {
      state.currentLocation = action.payload;
    },
    setNextLocation(state, action) {
      state.nextLocation = action.payload;
    },
    setisFormUpdate(state, action) {
      state.isFormUpdate = action.payload;
    },
    setFlushState(state) {
      state.currentLocation = '';
      state.nextLocation = '';
      state.isFormUpdate = false;
    },
  },
});

export const {
  setCurrentLocation,
  setNextLocation,
  setisFormUpdate,
  setFlushState,
} = currentLocationSlice.actions;

export default currentLocationSlice.reducer;
