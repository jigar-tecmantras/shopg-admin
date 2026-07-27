import React, {useEffect} from 'react';
import {Navigate, Route} from 'react-router-dom';
import {setAuthorization} from '../helpers/api_helper';
import {useDispatch} from 'react-redux';

import {useProfile} from 'Common/Hooks/UserHooks';

import {logoutUser} from 'slices/thunk';

const AuthProtected = (props: any): JSX.Element => {
  const dispatch = useDispatch<any>();
  const {userProfile, loading, token} = useProfile();
  useEffect(() => {
    if (Boolean(userProfile) && !loading && Boolean(token)) {
      setAuthorization(token);
    } else if (userProfile === null && loading && token === null) {
      dispatch(logoutUser());
    }
  }, [token, userProfile, loading, dispatch]);

  /*
    Navigate is un-auth access protected routes via url
    */

  if (userProfile === null && loading && token === null) {
    return <Navigate to={{pathname: '/login'}} />;
  }

  return <>{props.children}</>;
};

const AccessRoute = ({component: Component, ...rest}: any): JSX.Element => {
  return (
    <Route
      {...rest}
      render={(props: any) => {
        return (
          <>
            {' '}
            <Component {...props} />{' '}
          </>
        );
      }}
    />
  );
};

export {AuthProtected, AccessRoute};
