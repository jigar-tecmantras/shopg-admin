import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import SimpleBar from 'simplebar-react';
// import logo

// Import Components
import VerticalLayout from './VerticalLayouts/index';
import TwoColumnLayout from './TwoColumnLayout';
import {Button, Container} from 'react-bootstrap';
import HorizontalLayout from './HorizontalLayout';
import {useDispatch, useSelector} from 'react-redux';
import {setisFormUpdate} from 'slices/location/reducer';

const Sidebar = ({layoutType}: any): React.JSX.Element => {
  useEffect(() => {
    const verticalOverlay = document.getElementsByClassName('vertical-overlay');
    if (verticalOverlay != null) {
      verticalOverlay[0].addEventListener('click', function () {
        document.body.classList.remove('vertical-sidebar-enable');
      });
    }
  });

  const addEventListenerOnSmHoverMenu = (): void => {
    // add listener Sidebar Hover icon on change layout from setting
    if (
      document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover'
    ) {
      document.documentElement.setAttribute(
        'data-sidebar-size',
        'sm-hover-active',
      );
    } else if (
      document.documentElement.getAttribute('data-sidebar-size') ===
      'sm-hover-active'
    ) {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    } else {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    }
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isFormUpdate: boolean = useSelector(
    (state: any) => state.currentLocation.isFormUpdate,
  );
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
    navigate(path); // Proceed with navigation
  };

  return (
    <React.Fragment>
      <div className="app-menu navbar-menu">
        <div className="navbar-brand-box">
          <Link
            to="/"
            className="logo logo-dark d-none1"
            onClick={e => {
              e.preventDefault(); // Prevent default navigation
              handlePageNavigation(e, '/'); // Call your custom navigation handler
            }}>
            <span className="logo-sm">
              <img
                src="https://kabirworld.s3.ap-south-1.amazonaws.com/static_banner/favicon.png"
                alt=""
                height="26"
              />
            </span>
            <span className="logo-lg">
              <img
                src="https://kabirworld.s3.ap-south-1.amazonaws.com/static_banner/logo-dark.webp"
                alt=""
                height="45"
              />
            </span>
          </Link>

          <Link
            to="/"
            className="logo logo-light d-none1"
            onClick={e => {
              e.preventDefault(); // Prevent default navigation
              handlePageNavigation(e, '/'); // Call your custom navigation handler
            }}>
            <span className="logo-sm">
              <img
                src="https://kabirworld.s3.ap-south-1.amazonaws.com/static_banner/favicon.png"
                alt=""
                height="26"
              />
            </span>
            <span className="logo-lg">
              <img
                src="https://kabirworld.s3.ap-south-1.amazonaws.com/static_banner/logo-light.webp"
                alt=""
                height="45"
              />
            </span>
          </Link>
          <Button
            variant="link"
            data-testid="sm-hover-button"
            size="sm"
            onClick={addEventListenerOnSmHoverMenu}
            type="button"
            className="p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover">
            <i className="ri-record-circle-line"></i>
          </Button>
        </div>
        {layoutType === 'horizontal' ? (
          <div id="scrollbar">
            <Container fluid>
              <div id="two-column-menu"></div>
              <ul className="navbar-nav" id="navbar-nav">
                <HorizontalLayout />
              </ul>
            </Container>
          </div>
        ) : layoutType === 'twocolumn' ? (
          <React.Fragment>
            <TwoColumnLayout />
            <div className="sidebar-background"></div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <SimpleBar id="scrollbar" className="h-100">
              <Container fluid>
                <div id="two-column-menu"></div>
                <ul className="navbar-nav" id="navbar-nav">
                  <VerticalLayout />
                </ul>
              </Container>
            </SimpleBar>
            <div className="sidebar-background"></div>
          </React.Fragment>
        )}
      </div>
      <div className="vertical-overlay"></div>
    </React.Fragment>
  );
};

export default Sidebar;
