import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import withRouter from 'Common/withRouter';
import {Collapse} from 'react-bootstrap';

import {withTranslation} from 'react-i18next';

// Import Data
import navdata from '../LayoutMenuData';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setisFormUpdate} from 'slices/location/reducer';

interface NavItem {
  isHeader?: boolean;
  subItems?: NavItem[];
  label: string;
  link?: string;
  click?: () => void;
  icon: string;
  badgeName?: string;
  badgeColor?: string;
  stateVariables?: boolean;
  childItems?: NavItem[];
}
const VerticalLayout = (props: any): React.JSX.Element => {
  const path = props.router.location.pathname;
  const navData = navdata().props.children;

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    const initMenu = (): void => {
      const pathName = process.env.PUBLIC_URL + path;
      const ul: any = document.getElementById('navbar-nav');
      const items = ul.getElementsByTagName('a');
      const itemsArray = [...items]; // converts NodeList to Array
      removeActivation(itemsArray);
      const matchingMenuItem = itemsArray.find(x => {
        return x.pathname.split('-')?.[0] === pathName.split('-')?.[0];
      });

      if (
        matchingMenuItem instanceof HTMLAnchorElement ||
        matchingMenuItem === null
      ) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [path, props.layoutType]);

  function activateParentDropdown(item: any): boolean {
    item?.classList?.add('active');
    const parentCollapseDiv = item.closest('.collapse.menu-dropdown');

    if (parentCollapseDiv instanceof Element || parentCollapseDiv === null) {
      // to set aria expand true remaining
      parentCollapseDiv?.classList?.add('show');
      parentCollapseDiv?.parentElement?.children[0]?.classList?.add('active');
      parentCollapseDiv?.parentElement?.children[0]?.setAttribute(
        'aria-expanded',
        'true',
      );

      const parentCollapse = parentCollapseDiv?.parentElement?.closest(
        '.collapse.menu-dropdown',
      );

      if (parentCollapse instanceof Element || parentCollapse === null) {
        parentCollapse?.classList.add('show');
        const previousSibling = parentCollapse?.previousElementSibling;

        if (previousSibling != null) {
          previousSibling?.classList.add('active');
          return true; // Return true when previousSibling is not null
        }
      }
    }

    return false; // Return false when parentCollapseDiv is not an Element or is null
  }

  const removeActivation = (items: Element[]): void => {
    const actiItems = items.filter((x: Element) =>
      x.classList.contains('active'),
    );

    actiItems.forEach((item: Element) => {
      if (item.classList.contains('menu-link')) {
        if (!item.classList.contains('active')) {
          item.setAttribute('aria-expanded', 'false');
        }
        if (item.nextElementSibling instanceof HTMLElement) {
          item.nextElementSibling.classList.remove('show');
        }
      }
      if (item.classList.contains('nav-link')) {
        if (item.nextElementSibling instanceof HTMLElement) {
          item.nextElementSibling.classList.remove('show');
        }
        item.setAttribute('aria-expanded', 'false');
      }
      item.classList.remove('active');
    });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isFormUpdate: boolean = useSelector(
    (state: any) => state.currentLocation.isFormUpdate,
  );
  // console.log(isFormUpdate);
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
  // test comment
  return (
    <React.Fragment>
      {/* menu Items */}
      {navData.map((item: NavItem, key: number) => {
        return (
          <React.Fragment key={key}>
            {/* Main Header */}
            {item.isHeader ?? false ? (
              <li className="menu-title">
                <span data-key="t-menu">{props.t(item.label)} </span>
              </li>
            ) : (
              <>
                {item.subItems != null && (
                  <li className="nav-item">
                    <Link
                      to={item.link ?? '/'}
                      onClick={item.click}
                      className="nav-link menu-link"
                      data-bs-toggle="collapse">
                      <i className={item.icon}></i>
                      <span data-key="t-apps">{props.t(item.label)}</span>
                      {item.badgeName != null ? (
                        <span
                          className={
                            'badge badge-pill bg-soft-' + item.badgeColor
                          }
                          data-key="t-new">
                          {item.badgeName}
                        </span>
                      ) : null}
                    </Link>
                    <Collapse
                      className="menu-dropdown"
                      // className="menu-dropdown"
                      in={item.stateVariables}>
                      <div id="example-collapse-text">
                        <ul className="nav nav-sm flex-column">
                          {/* subItms  */}
                          {item?.subItems?.map((subItem: any, key: number) => (
                            <React.Fragment key={key}>
                              {subItem.isChildItem === null ? (
                                <li className="nav-item">
                                  <Link to={subItem.link} className="nav-link">
                                    {props.t(subItem.label)}
                                    {subItem.badgeName != null ? (
                                      <span
                                        className={
                                          'badge badge-pill bg-soft-' +
                                          subItem.badgeColor
                                        }
                                        data-key="t-new">
                                        {subItem.badgeName}
                                      </span>
                                    ) : null}
                                  </Link>
                                </li>
                              ) : (
                                <li className="nav-item">
                                  <Link
                                    to={subItem.link}
                                    onClick={subItem.click}
                                    className="nav-link"
                                    data-bs-toggle="collapse">
                                    {props.t(subItem.label)}
                                  </Link>
                                  <Collapse
                                    className="menu-dropdown"
                                    in={subItem.stateVariables}>
                                    <div>
                                      <ul className="nav nav-sm flex-column">
                                        {/* child subItms  */}
                                        {subItem?.childItems?.map(
                                          (childItem: any, key: number) => (
                                            <React.Fragment key={key}>
                                              {childItem.childItems === null ? (
                                                <li className="nav-item">
                                                  <Link
                                                    to={childItem.link ?? '/'}
                                                    className="nav-link">
                                                    {props.t(childItem.label)}
                                                  </Link>
                                                </li>
                                              ) : (
                                                <li className="nav-item">
                                                  <Link
                                                    to="/"
                                                    onClick={childItem.click}
                                                    className="nav-link"
                                                    data-bs-toggle="collapse">
                                                    {props.t(childItem.label)}
                                                  </Link>
                                                  <Collapse
                                                    className="menu-dropdown"
                                                    in={
                                                      childItem.stateVariables
                                                    }>
                                                    <div>
                                                      <ul className="nav nav-sm flex-column">
                                                        {childItem?.childItems?.map(
                                                          (
                                                            subChildItem: any,
                                                            key: number,
                                                          ) => (
                                                            <li
                                                              className="nav-item"
                                                              key={key}>
                                                              <Link
                                                                to={
                                                                  subChildItem.link
                                                                }
                                                                className="nav-link">
                                                                {props.t(
                                                                  subChildItem.label,
                                                                )}
                                                              </Link>
                                                            </li>
                                                          ),
                                                        )}
                                                      </ul>
                                                    </div>
                                                  </Collapse>
                                                </li>
                                              )}
                                            </React.Fragment>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  </Collapse>
                                </li>
                              )}
                            </React.Fragment>
                          ))}
                        </ul>
                      </div>
                    </Collapse>
                  </li>
                )}
                {item.subItems == null && (
                  <li className="nav-item">
                    <Link
                      to={item.link ?? '/'}
                      className="nav-link menu-link testchild"
                      onClick={e => {
                        e.preventDefault(); // Prevent default navigation
                        handlePageNavigation(e, item.link ?? '/'); // Call the custom click handler
                      }}>
                      <i className={item.icon}></i>{' '}
                      <span>{props.t(item.label)}</span>
                      {item.badgeName != null ? (
                        <span
                          className={
                            'badge badge-pill badge-soft-' + item.badgeColor
                          }
                          data-key="t-new">
                          {item.badgeName}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                )}
              </>
            )}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

VerticalLayout.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(VerticalLayout));
