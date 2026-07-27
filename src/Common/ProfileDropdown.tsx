import React, {useState, useEffect} from 'react';
import {Dropdown} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
// import images
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import {variables} from 'utils/constant';
import {removeLoginToken} from 'slices/auth/login/reducer';
import {createSelector} from 'reselect';
import DefaultProfileImg from '../assets/images/defaultProfileImg.jpg';
import {setisFormUpdate} from 'slices/location/reducer';

const ProfileDropdown = (): React.JSX.Element => {
  const [userName, setUserName] = useState<any>('Admin');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isFormUpdate: boolean = useSelector(
    (state: any) => state.currentLocation.isFormUpdate,
  );
  // console.log(isFormUpdate);

  const selectLayoutProperties = createSelector(
    (state: any) => state.Profile,
    profile => ({
      success: profile.success,
      name: profile.user.userName,
    }),
  );

  const handelLogout = (): void => {
    // console.log('jn');
    Cookies.remove(variables.ecommerce_admin);
    localStorage.removeItem(variables.WAREHOUSE_USERNAME);
    dispatch(removeLoginToken());
    navigate('/login');
  };

  const {success} = useSelector(selectLayoutProperties);
  const {name}: any = useSelector(selectLayoutProperties);

  useEffect(() => {
    const authUserString = localStorage.getItem('authUser');
    if (authUserString != null) {
      if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
        const obj = JSON.parse(localStorage.getItem('authUser') ?? '{}');
        const getUserName =
          obj.displayName === undefined ? 'Admin' : obj.displayName;
        setUserName(getUserName);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === 'fake' ||
        process.env.REACT_APP_DEFAULTAUTH === 'jwt'
      ) {
        const obj = JSON.parse(localStorage.getItem('authUser') ?? '{}');

        setUserName(obj.username);
      }
    }
  }, [success, name]);
  const handlePageNavigation: any = (e: any, path: string) => {
    e.preventDefault();
    if (isFormUpdate) {
      const userConfirmed = window.confirm(
        'You have unsaved changes. Do you really want to leave?',
      );
      if (!userConfirmed) {
        return; // Stay on the current page
      }
      dispatch(setisFormUpdate(false));
    }
    dispatch(setisFormUpdate(false));
    if (path !== 'logout') {
      navigate(path); // Proceed with navigation
    } else {
      handelLogout();
    }
  };
  return (
    <Dropdown className="ms-sm-3 header-item topbar-user">
      <Dropdown.Toggle
        type="button"
        className="btn bg-transparent border-0 arrow-none"
        id="page-header-user-dropdown">
        <span className="d-flex align-items-center">
          <img
            className="rounded-circle header-profile-user"
            src={DefaultProfileImg}
            alt="Header Avatar"
          />
          <span className="text-start ms-xl-2">
            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
              {name?.first}
            </span>
            <span className="d-none d-xl-block ms-1 fs-13 text-muted user-name-sub-text">
              {name?.last}
            </span>
          </span>
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-end">
        <h6 className="dropdown-header">Welcome {name?.first ?? userName}!</h6>
        <Dropdown.Item>
          <i className="mdi mdi-account text-muted fs-16 align-middle me-1"></i>{' '}
          <span
            className="align-middle"
            data-key="t-profile"
            onClick={e => {
              e.preventDefault();
              handlePageNavigation(e, '/update-profile');
              // navigate('/update-profile');
            }}>
            Update Profile
          </span>
        </Dropdown.Item>
        <Dropdown.Item>
          <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{' '}
          <span
            className="align-middle"
            data-key="t-logout"
            onClick={e => {
              handlePageNavigation(e, 'logout');
            }}>
            Logout
          </span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
