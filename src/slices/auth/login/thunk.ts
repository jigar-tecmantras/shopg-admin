// Include Both Helper File with needed methods
import {getFirebaseBackend} from '../../../helpers/firebase_helper';
import {postFakeLogin, postJwtLogin} from '../../../helpers/fakebackend_helper';

import {
  setLoginToken,
  removeLoginToken,
  apiError,
  // resetLoginFlag,
} from './reducer';

export const loginUser = (user: any, router: any) => async (dispatch: any) => {
  try {
    let response;
    if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
      const fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.loginUser(user.email, user.password);
    } else if (process.env.REACT_APP_DEFAULTAUTH === 'jwt') {
      response = postJwtLogin({
        email: user.email,
        password: user.password,
      });
    } else if (process.env.REACT_APP_DEFAULTAUTH != null) {
      response = postFakeLogin({
        email: user.email,
        password: user.password,
      });
    }

    let data: any = await response;
    if (data !== null) {
      localStorage.setItem('authUser', JSON.stringify(data));
      if (process.env.REACT_APP_DEFAULTAUTH === 'fake') {
        let finallogin: any = JSON.stringify(data);
        finallogin = JSON.parse(finallogin);
        data = finallogin.data;
        if (Boolean(finallogin.username) && Boolean(finallogin.password)) {
          dispatch(setLoginToken(data));
          router('/');
        } else {
          dispatch(apiError(finallogin));
        }
      } else {
        dispatch(setLoginToken(data));
        router('/');
      }
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch: any) => {
  try {
    localStorage.removeItem('authUser');
    const fireBaseBackend = getFirebaseBackend();
    if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
      const response = fireBaseBackend.logout;
      dispatch(removeLoginToken(response));
    }
    // else {
    //   dispatch(logoutUserSuccess(true));
    // }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin =
  (type: any, history: any) => async (dispatch: any) => {
    try {
      let response;

      if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
        const fireBaseBackend = getFirebaseBackend();
        response = fireBaseBackend.socialLoginUser(type);
      }
      //  else {
      //   response = postSocialLogin(data);
      // }

      const socialdata = await response;
      if (socialdata != null) {
        localStorage.setItem('authUser', JSON.stringify(socialdata));
        dispatch(setLoginToken(socialdata));
        history('/dashboard');
      }
    } catch (error) {
      dispatch(apiError(error));
    }
  };

// export const resetLoginFlag = () => async (dispatch: any) => {
//   try {
//     const response = dispatch(resetLoginFlag());
//     return response;
//   } catch (error) {
//     dispatch(apiError(error));
//   }
// };
