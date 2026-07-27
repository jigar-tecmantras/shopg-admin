import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as url from '../url_helper';

import accessToken from '../jwt-token-access/accessToken';

const users = [
  {
    uid: 1,
    username: 'admin',
    role: 'admin',
    password: '123456',
    email: 'admin@themesbrand.com',
  },
];

const fakeBackend = (): void => {
  // This sets the mock adapter on the default instance
  const mock = new MockAdapter(axios, {onNoMatch: 'passthrough'});

  mock.onPost(url.POST_FAKE_REGISTER).reply(async (config: any) => {
    const user = JSON.parse(config.data);
    users.push(user);
    return await new Promise(resolve => {
      setTimeout(() => {
        resolve([200, user]);
      });
    });
  });

  mock.onPost(url.POST_FAKE_LOGIN).reply(async (config: any) => {
    const user = JSON.parse(config.data);
    const validUser = users.filter(
      usr => usr.email === user.email && usr.password === user.password,
    );

    return await new Promise(resolve => {
      setTimeout(() => {
        if (validUser.length === 1) {
          resolve([200, validUser[0]]);
        }
        // else {
        //   reject(
        //     'Username and password are invalid. Please enter correct username and password',
        //   );
        // }
      });
    });
  });

  mock.onPost('/fake-forget-pwd').reply(async () => {
    // User needs to check that user is eXist or not and send mail for Reset New password

    return await new Promise(resolve => {
      setTimeout(() => {
        resolve([200, 'Check you mail and reset your password.']);
      });
    });
  });

  mock.onPost('/post-jwt-register').reply(async (config: any) => {
    const user = JSON.parse(config.data);
    users.push(user);

    return await new Promise(resolve => {
      setTimeout(() => {
        resolve([200, user]);
      });
    });
  });

  mock.onPost('/post-jwt-login').reply(async (config: any) => {
    const user = JSON.parse(config.data);
    const validUser = users.filter(
      usr => usr.email === user.email && usr.password === user.password,
    );

    return await new Promise(resolve => {
      setTimeout(() => {
        if (validUser.length === 1) {
          // You have to generate AccessToken by jwt. but this is fakeBackend so, right now its dummy
          const token = accessToken;
          // JWT AccessToken
          const tokenObj = {accessToken: token}; // Token Obj
          const validUserObj = {...validUser[0], ...tokenObj}; // validUser Obj

          resolve([200, validUserObj]);
        }
        // else {
        //   reject([
        //     400,
        //     'Username and password are invalid. Please enter correct username and password',
        //   ]);
        // }
      });
    });
  });

  mock.onPost('/post-jwt-profile').reply(async (config: any) => {
    const user = JSON.parse(config.data);

    const one = config.headers;

    const finalToken = one?.Authorization;

    const validUser = users.filter(usr => usr.uid === user.idx);

    return await new Promise(resolve => {
      setTimeout(() => {
        // Verify Jwt token from header.Authorization
        if (finalToken === accessToken) {
          if (validUser.length === 1) {
            // Find index of specific object using findIndex method.
            const objIndex = users.findIndex(obj => obj.uid === user.idx);

            // Update object's name property.
            users[objIndex].username = user.username;

            // Assign a value to locastorage
            localStorage.removeItem('authUser');
            localStorage.setItem('authUser', JSON.stringify(users[objIndex]));

            resolve([200, 'Profile Updated Successfully']);
          }
          //  else {
          //   reject([400, 'Something wrong for edit profile']);
          // }
        }
        //  else {
        //   reject([400, 'Invalid Token !!']);
        // }
      });
    });
  });

  mock.onPost(url.POST_EDIT_PROFILE).reply(async (config: any) => {
    const user = JSON.parse(config.data);

    const validUser = users.filter(usr => usr.uid === user.idx);

    return await new Promise(resolve => {
      setTimeout(() => {
        if (validUser.length === 1) {
          // Find index of specific object using findIndex method.
          const objIndex = users.findIndex(obj => obj.uid === user.idx);

          // Update object's name property.
          users[objIndex].username = user.username;

          // Assign a value to locastorage
          localStorage.removeItem('authUser');
          localStorage.setItem('authUser', JSON.stringify(users[objIndex]));

          resolve([200, 'Profile Updated Successfully']);
        }
        // else {
        //   reject([400, 'Something wrong for edit profile']);
        // }
      });
    });
  });

  mock.onPost('/jwt-forget-pwd').reply(async () => {
    // User needs to check that user is eXist or not and send mail for Reset New password

    return await new Promise(resolve => {
      setTimeout(() => {
        resolve([200, 'Check you mail and reset your password.']);
      });
    });
  });

  mock.onPost('/social-login').reply(async (config: any) => {
    const user = JSON.parse(config.data);

    return await new Promise(resolve => {
      setTimeout(() => {
        if (user?.token != null) {
          // You have to generate AccessToken by jwt. but this is fakeBackend so, right now its dummy
          const token = accessToken;

          // JWT AccessToken
          const tokenObj = {accessToken: token}; // Token Obj
          const validUserObj = {...user[0], ...tokenObj}; // validUser Obj

          resolve([200, validUserObj]);
        }
        // else {
        //   reject([
        //     400,
        //     'Username and password are invalid. Please enter correct username and password',
        //   ]);
        // }
      });
    });
  });

  mock.onPost(url.ADD_NEW_EVENT).reply(async (event: any) => {
    return await new Promise(resolve => {
      setTimeout(() => {
        if (event?.data != null) {
          // Passing fake JSON data as response
          resolve([200, event.data]);
        }
        //  else {
        //   reject([400, 'Cannot add event']);
        // }
      });
    });
  });

  mock.onPatch(url.UPDATE_EVENT).reply(async (event: any) => {
    return await new Promise(resolve => {
      setTimeout(() => {
        if (event?.data != null) {
          // Passing fake JSON data as response
          resolve([200, event.data]);
        }
        // else {
        //   reject([400, 'Cannot update event']);
        // }
      });
    });
  });

  mock.onDelete(url.DELETE_EVENT).reply(async (config: any) => {
    return await new Promise(resolve => {
      setTimeout(() => {
        if (config?.headers != null) {
          // Passing fake JSON data as response
          resolve([200, config.headers.event]);
        }
        // else {
        //   reject([400, 'Cannot delete event']);
        // }
      });
    });
  });
};

export default fakeBackend;
