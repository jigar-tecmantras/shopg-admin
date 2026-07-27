import {createSlice} from '@reduxjs/toolkit';
import {variables} from 'utils/constant';
import {getLocalStorageItem} from 'utils/localStorageUtil';

export const initialState = {
  error: '',
  success: '',
  user: {
    userName: getLocalStorageItem(variables.WAREHOUSE_USERNAME),
  },
};

const ProfileSlice = createSlice({
  name: 'Profile',
  initialState,
  reducers: {
    profileSuccess(state, action) {
      state.success = action.payload;
      state.user = action.payload.data;
    },
    profileError(state, action) {
      state.error = action.payload;
    },
    editProfileChange() {
      // state = {...state};
    },
    setUserName(state, action) {
      state.user.userName = action.payload.userName;
    },
    resetProfileFlagChange(state) {
      // state.success = "",
      state.error = '';
    },
  },
});

export const {
  profileSuccess,
  profileError,
  setUserName,
  editProfileChange,
  resetProfileFlagChange,
} = ProfileSlice.actions;

export default ProfileSlice.reducer;
