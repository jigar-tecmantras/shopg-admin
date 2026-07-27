import {APIClient} from './api_helper';
import * as url from './url_helper';

const api = new APIClient();

// Gets the logged in user data from local session
export const getLoggedInUser = (): any => {
  const user = localStorage.getItem('user');
  if (user != null) return JSON.parse(user);
  return null;
};

// is user is logged in
export const isUserAuthenticated = (): boolean => {
  return getLoggedInUser() !== null;
};

// Register Method
export const postFakeRegister = async (data: any): Promise<any> => {
  return await api.create(url.POST_FAKE_REGISTER, data).catch(err => {
    let message;
    if (err.response?.status != null) {
      switch (err.response.status) {
        case 404:
          message = 'Sorry! the page you are looking for could not be found';
          break;
        case 500:
          message =
            'Sorry! something went wrong, please contact our support team';
          break;
        case 401:
          message = 'Invalid credentials';
          break;
        default:
          message = err[1];
          break;
      }
    }
    throw message;
  });
};

// Login Method
export const postFakeLogin = async (data: any): Promise<any> =>
  await api.create(url.POST_FAKE_LOGIN, data);

// postForgetPwd
export const postFakeForgetPwd = async (data: any): Promise<any> =>
  await api.create(url.POST_FAKE_PASSWORD_FORGET, data);

// Edit profile
export const postJwtProfile = async (data: any): Promise<any> =>
  await api.create(url.POST_EDIT_JWT_PROFILE, data);

export const postFakeProfile = async (data: any): Promise<any> =>
  await api.create(url.POST_EDIT_PROFILE, data);

// Register Method
export const postJwtRegister = async (url: any, data: any): Promise<any> => {
  return await api.create(url, data).catch(err => {
    let message;
    if (err.response?.status != null) {
      switch (err.response.status) {
        case 404:
          message = 'Sorry! the page you are looking for could not be found';
          break;
        case 500:
          message =
            'Sorry! something went wrong, please contact our support team';
          break;
        case 401:
          message = 'Invalid credentials';
          break;
        default:
          message = err[1];
          break;
      }
    }
    throw message;
  });
};

// Login Method
export const postJwtLogin = async (data: any): Promise<any> =>
  await api.create(url.POST_FAKE_JWT_LOGIN, data);

// postForgetPwd
export const postJwtForgetPwd = async (data: any): Promise<any> =>
  await api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// add Events
export const addNewEvent = async (event: any): Promise<any> =>
  await api.create(url.ADD_NEW_EVENT, event);

// update Event
export const updateEvent = async (event: any): Promise<any> =>
  await api.update(url.UPDATE_EVENT, event);

// delete Event
export const deleteEvent = async (event: any): Promise<any> =>
  await api.delete(url.DELETE_EVENT, {headers: {event}});

// status change
export const ChangeStatus = async (event: any): Promise<any> =>
  await api.delete(url.DELETE_EVENT, {headers: {event}});
