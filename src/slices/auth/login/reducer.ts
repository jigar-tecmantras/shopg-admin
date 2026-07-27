import {createSlice} from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import {variables} from 'utils/constant';

const isCookie = Cookies.get(variables.ecommerce_admin);

export const initialState = {
  token: isCookie ?? null,
  error: '',
  loading: false,
  isUserLogout: false,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.isUserLogout = false;
    },
    setLoginToken(state, action) {
      state.token = action.payload; // Assuming the token is in the payload
      state.loading = false;
    },
    removeLoginToken(state) {
      state.isUserLogout = true;
      state.token = null; // Clear the token on logout
    },
    resetLoginFlag(state) {
      state.error = '';
    },
  },
});

export const {apiError, setLoginToken, removeLoginToken, resetLoginFlag} =
  loginSlice.actions;

export default loginSlice.reducer;
