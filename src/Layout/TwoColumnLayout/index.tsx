import React, {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import withRouter from 'Common/withRouter';

import PropTypes from 'prop-types';
import {Collapse, Container} from 'react-bootstrap';

import logoSm from 'assets/images/logo-sm.png';
// i18n
import {withTranslation} from 'react-i18next';

// Import Data
import navdata from '../LayoutMenuData';
import VerticalLayout from '../VerticalLayouts';

// SimpleBar
import SimpleBar from 'simplebar-react';

const TwoColumnLayout = (props: any): JSX.Element => {
  const navData = navdata().props.children;
  const activateParentDropdown = useCallback(
    (item: any, activateIconSidebarActiveFn = activateIconSidebarActive) => {
      item?.classList.add('active');
      const parentCollapseDiv = item.closest('.collapse.menu-dropdown');
      if (parentCollapseDiv instanceof Element || parentCollapseDiv === null) {
        // to set aria expand true remaining
        parentCollapseDiv?.classList.add('show');
        parentCollapseDiv.parentElement.children[0]?.classList.add('active');
        parentCollapseDiv.parentElement.children[0].setAttribute(
          'aria-expanded',
          'true',
        );
        const parentCollapse = parentCollapseDiv.parentElement?.closest(
          '.collapse.menu-dropdown',
        );
        if (parentCollapse instanceof Element || parentCollapse === null) {
          parentCollapseDiv.parentElement
            .closest('.collapse')
            ?.classList.add('show');
          const parentParentCollapse =
            parentCollapseDiv.parentElement.closest('.collapse')
              ?.previousElementSibling;
          if (parentParentCollapse != null) {
            parentParentCollapse?.classList.add('active');
            if (parentCollapse instanceof Element || parentCollapse === null) {
              parentParentCollapse
                .closest('.collapse.menu-dropdown')
                ?.classList.add('show');
            }
          }
        }
        // test comment
        activateIconSidebarActiveFn(
          parentCollapseDiv.firstChild.getAttribute('id'),
        );
        return false;
      }
      return false;
    },
    [],
  );

  const path = props.router.location.pathname;

  const initMenu = useCallback(() => {
    const pathName = process.env.PUBLIC_URL + props.router.location.pathname;
    const ul: any | null = document.getElementById('navbar-nav');
    const items = ul?.getElementsByTagName('a');
    const itemsArray = [...items]; // converts NodeList to Array
    removeActivation(itemsArray);

    const matchingMenuItem = itemsArray.find(
      (x: HTMLAnchorElement | undefined) => {
        return x?.pathname === pathName;
      },
    );

    if (
      matchingMenuItem instanceof HTMLAnchorElement ||
      matchingMenuItem === null
    ) {
      activateParentDropdown(matchingMenuItem);
    } else {
      let id = '';
      if (process.env.PUBLIC_URL != null) {
        id = pathName.replace(process.env.PUBLIC_URL, '');
        id = id.replace('/', '');
      } else {
        id = pathName.replace('/', '');
      }

      if (id != null) {
        document.body?.classList.add('twocolumn-panel');
        activateIconSidebarActive(id);
      }
    }
  }, [props.router.location.pathname, activateParentDropdown]);

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    initMenu();
  }, [path, initMenu]);

  function activateIconSidebarActive(id: any): void {
    const menu = document.querySelector(
      "#two-column-menu .simplebar-content-wrapper a[class='nav-icon " +
        id +
        "'].nav-icon",
    );
    if (menu !== null) {
      menu?.classList.add('active');
    }
  }

  const removeActivation = (items: Element[]): void => {
    const activeItems = items.filter(
      (x: Element) => x?.classList.contains('active'),
    );
    activeItems.forEach((item: Element) => {
      if (item?.classList.contains('menu-link')) {
        if (!item?.classList.contains('active')) {
          item.setAttribute('aria-expanded', 'false');
        }
        item.nextElementSibling?.classList.remove('show');
      }
      if (item?.classList.contains('nav-link')) {
        if (item.nextElementSibling instanceof HTMLElement) {
          item.nextElementSibling?.classList.remove('show');
        }
        item.setAttribute('aria-expanded', 'false');
      }
      item?.classList.remove('active');
    });

    const ul: any = document.getElementById('two-column-menu');
    const iconItems = ul.getElementsByTagName('a');
    const itemsArray = [...iconItems];
    const activeIconItems = itemsArray.filter(
      x => x?.classList.contains('active'),
    );
    activeIconItems.forEach(item => {
      item?.classList.remove('active');
      const id = item.getAttribute('subitems');
      if (document.getElementById(id) != null)
        document.getElementById(id)?.classList.remove('show');
    });
  };

  // Resize sidebar
  const [isMenu, setIsMenu] = useState('twocolumn');
  const windowResizeHover = (): void => {
    initMenu();
    const windowSize = document.documentElement.clientWidth;
    if (windowSize < 767) {
      document.documentElement.setAttribute('data-layout', 'vertical');
      setIsMenu('vertical');
    } else {
      document.documentElement.setAttribute('data-layout', 'twocolumn');
      setIsMenu('twocolumn');
    }
  };

  useEffect(function setupListener() {
    if (props.layoutType === 'twocolumn') {
      window.addEventListener('resize', windowResizeHover);

      // remove classname when component will unmount
      return function cleanupListener() {
        window.removeEventListener('resize', windowResizeHover);
      };
    }
  });
  return (
    <React.Fragment>
      {isMenu === 'twocolumn' ? (
        <div id="scrollbar">
          <Container fluid>
            <div id="two-column-menu">
              <SimpleBar className="twocolumn-iconview">
                <Link to="#" className="logo" data-testid="logo-link">
                  <img src={logoSm} alt="" height="22" />
                </Link>
                {navData?.map((item: any, key: number) => {
                  return (
                    <React.Fragment key={key}>
                      {item.icon != null &&
                        (item.subItems != null ? (
                          <li>
                            <Link
                              onClick={item.click}
                              to="#"
                              // subitems={item.id}
                              className={'nav-icon ' + item.id}
                              data-bs-toggle="collapse">
                              <i className={item.icon}></i>
                            </Link>
                          </li>
                        ) : (
                          <li>
                            <Link
                              onClick={item.click}
                              to={item.link ?? '/#'}
                              // subitems={item.id}
                              className={'nav-icon ' + item.id}
                              data-bs-toggle="collapse">
                              <i className={item.icon}></i>
                            </Link>
                          </li>
                        ))}
                    </React.Fragment>
                  );
                })}
              </SimpleBar>
            </div>
            <SimpleBar id="navbar-nav" className="navbar-nav">
              {navData?.map(
                (item: any, key: number): React.JSX.Element => (
                  <React.Fragment key={key}>
                    {item.subItems != null ? (
                      <li className="nav-item">
                        <Collapse
                          className="menu-dropdown"
                          // className={item.stateVariables ? "menu-dropdown d-block" : "menu-dropdown d-none"}
                          in={item.stateVariables}>
                          <div>
                            <ul
                              className="nav nav-sm flex-column test"
                              id={item.id}>
                              {/* subItms  */}
                              {item.subItems?.map(
                                (subItem: any, key: number) => (
                                  <React.Fragment key={key}>
                                    {subItem.isChildItem != null ? (
                                      <li className="nav-item">
                                        <Link
                                          to={subItem.link ?? '/#'}
                                          className="nav-link">
                                          {props.t(subItem.label)}
                                          {subItem.badgeName != null ? (
                                            <span
                                              className={
                                                'badge badge-pill bg-' +
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
                                          onClick={subItem.click}
                                          className="nav-link"
                                          to="/#"
                                          data-bs-toggle="collapse"
                                          aria-expanded={
                                            subItem.stateVariables != null
                                              ? 'true'
                                              : 'false'
                                          }>
                                          {' '}
                                          {props.t(subItem.label)}
                                          {subItem.badgeName != null ? (
                                            <span
                                              className={
                                                'badge badge-pill bg-' +
                                                subItem.badgeColor
                                              }
                                              data-key="t-new">
                                              {subItem.badgeName}
                                            </span>
                                          ) : null}
                                        </Link>
                                        <Collapse
                                          className="menu-dropdown"
                                          in={subItem.stateVariables}>
                                          <div>
                                            <ul
                                              className="nav nav-sm flex-column"
                                              id={item.id}>
                                              {/* child subItems  */}
                                              {subItem.childItems?.map(
                                                (
                                                  childItem: any,
                                                  key: number,
                                                ) => (
                                                  <li
                                                    className="nav-item"
                                                    key={key}>
                                                    <Link
                                                      to={
                                                        childItem.link ?? '/#'
                                                      }
                                                      onClick={childItem.click}
                                                      className="nav-link">
                                                      {props.t(childItem.label)}
                                                    </Link>
                                                    <Collapse
                                                      className="menu-dropdown"
                                                      in={
                                                        childItem.stateVariables
                                                      }>
                                                      <div>
                                                        <ul
                                                          className="nav nav-sm flex-column"
                                                          id={item.id}>
                                                          {/* child subChildItems  */}
                                                          {childItem.isChildItem?.map(
                                                            (
                                                              subChildItem: any,
                                                              key: number,
                                                            ) => (
                                                              <li
                                                                className="nav-item"
                                                                key={key}>
                                                                <Link
                                                                  to={
                                                                    subChildItem.link ??
                                                                    '/#'
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
                    ) : null}
                  </React.Fragment>
                ),
              )}
            </SimpleBar>
          </Container>
        </div>
      ) : (
        <SimpleBar id="scrollbar" className="h-100">
          <Container fluid>
            <div id="two-column-menu"></div>
            <ul className="navbar-nav" id="navbar-nav">
              <VerticalLayout />
            </ul>
          </Container>
        </SimpleBar>
      )}
    </React.Fragment>
  );
};

TwoColumnLayout.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(TwoColumnLayout));
