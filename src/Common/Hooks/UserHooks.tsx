import {useEffect, useState} from 'react';
import {getLoggedinUser} from '../../helpers/api_helper';

interface UserProfile {
  userProfile: any;
  loading: boolean;
  token: any;
}

const useProfile = (): UserProfile => {
  const userProfileSession = getLoggedinUser();
  const token = userProfileSession?.token;
  const [loading, setLoading] = useState(
    typeof userProfileSession !== 'boolean',
  );
  const [userProfile, setUserProfile] = useState(userProfileSession ?? null);

  useEffect(() => {
    const userProfileSession = getLoggedinUser();
    const token = userProfileSession?.token;
    setUserProfile(userProfileSession ?? null);
    setLoading(typeof token !== 'boolean');
  }, []);

  return {userProfile, loading, token};
};

export {useProfile};
