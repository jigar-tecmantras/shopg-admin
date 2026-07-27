import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import withRouter from 'Common/withRouter';
import {Col, Collapse, Row} from 'react-bootstrap';

// Import Data
import navdata from '../LayoutMenuData';
// i18n
import {withTranslation} from 'react-i18next';

const HorizontalLayout = (props: any): React.JSX.Element => {
  const [isMoreMenu, setIsMoreMenu] = useState(false);
  const navData = navdata().props.children;
  const menuItems = [];
  const splitMenuItems: any = [];
  let menuSplitContainer = 5;
  navData.forEach(function (value: any, key: number) {
    if (value.isHeader != null) {
      menuSplitContainer++;
    }
    if (key >= menuSplitContainer) {
      const val: any = value;
      val.childItems = value.subItems;
      val.isChildItem = value.subItems !== null && value.subItems !== undefined;
      delete val.subItems;
      splitMenuItems.push(val);
    } else {
      menuItems.push(value);
    }
  });
  menuItems.push({
    id: 'more',
    label: 'More',
    icon: 'ri-briefcase-2-line',
    link: '/#',
    stateVariables: isMoreMenu,
    subItems: splitMenuItems,
    click: function (e: any) {
      e.preventDefault();
      setIsMoreMenu(!isMoreMenu);
    },
  });

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    const initMenu = (): void => {
      const pathName = process.env.PUBLIC_URL + props.router.location.pathname;
      const ul: any = document.getElementById('navbar-nav');
      const items = ul.getElementsByTagName('a');
      const itemsArray = [...items]; // converts NodeList to Array
      removeActivation(itemsArray);
      const matchingMenuItem = itemsArray.find(x => {
        return x.pathname === pathName;
      });
      if (
        matchingMenuItem instanceof HTMLAnchorElement ||
        matchingMenuItem === null
      ) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.router.location.pathname, props.layoutType]);

  function activateParentDropdown(item: any): boolean {
    item.classList.add('active');
    const parentCollapseDiv = item.closest('.collapse.menu-dropdown');

    if (parentCollapseDiv instanceof Element || parentCollapseDiv === null) {
      // to set aria expand true remaining
      parentCollapseDiv.classList.add('show');
      parentCollapseDiv.parentElement.children[0].classList.add('active');
      parentCollapseDiv.parentElement.children[0].setAttribute(
        'aria-expanded',
        'true',
      );
      const parentCollapse = parentCollapseDiv.parentElement.closest(
        '.collapse.menu-dropdown',
      );
      if (parentCollapse instanceof Element || parentCollapse === null) {
        parentCollapseDiv.parentElement
          .closest('.collapse')
          .classList.add('show');
        const parentElementDiv =
          parentCollapseDiv.parentElement.closest(
            '.collapse',
          ).previousElementSibling;
        if (parentElementDiv != null)
          if (parentElementDiv.closest('.collapse') != null)
            parentElementDiv.closest('.collapse').classList.add('show');
        parentElementDiv.classList.add('active');
        const parentElementSibling =
          parentElementDiv.parentElement.parentElement.parentElement
            .previousElementSibling;
        if (parentElementSibling != null) {
          parentElementSibling.classList.add('active');
        }
      }
      return false;
    }
    return false;
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
        item.nextElementSibling?.classList.remove('show');
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

  return (
    <React.Fragment>
      {menuItems?.map((item: any, key: number) => {
        return (
          <React.Fragment key={key}>
            {/* Main Header */}
            {item.isHeader === null ? (
              <>
                {item.subItems != null && (
                  <li className="nav-item">
                    <Link
                      onClick={item.click}
                      className="nav-link menu-link"
                      to={item.link ?? '/#'}
                      data-bs-toggle="collapse">
                      <i className={item.icon}></i>{' '}
                      <span data-key="t-apps">{props.t(item.label)}</span>
                    </Link>
                    <Collapse
                      className={
                        item.id === 'baseUi' && item.subItems.length > 13
                          ? 'menu-dropdown mega-dropdown-menu'
                          : 'menu-dropdown'
                      }
                      in={item.stateVariables}>
                      {/* subItms  */}
                      {item.id === 'baseUi' && item.subItems.length > 13 ? (
                        <Row id="sidebarApps">
                          {item.subItems?.map((subItem: any, key: number) => (
                            <React.Fragment key={key}>
                              {key % 2 === 0 ? (
                                <Col lg={4}>
                                  <ul className="nav nav-sm flex-column">
                                    <li className="nav-item">
                                      <Link
                                        to={item.subItems[key].link}
                                        className="nav-link">
                                        {item.subItems[key].label}
                                      </Link>
                                    </li>
                                  </ul>
                                </Col>
                              ) : (
                                <Col lg={4}>
                                  <ul className="nav nav-sm flex-column">
                                    <li className="nav-item">
                                      <Link
                                        to={item.subItems[key].link}
                                        className="nav-link">
                                        {item.subItems[key].label}
                                      </Link>
                                    </li>
                                  </ul>
                                </Col>
                              )}
                            </React.Fragment>
                          ))}
                        </Row>
                      ) : (
                        <ul className="nav nav-sm flex-column test">
                          {item.subItems?.map((subItem: any, key: number) => (
                            <React.Fragment key={key}>
                              {subItem.isHeader === null ? (
                                <React.Fragment>
                                  {subItem.isChildItem === null ? (
                                    <li className="nav-item">
                                      <Link
                                        to={subItem.link ?? '/#'}
                                        className="nav-link">
                                        {subItem.icon != null ? (
                                          <React.Fragment>
                                            <i className={subItem.icon}></i>{' '}
                                            <span>
                                              {props.t(subItem.label)}
                                            </span>
                                          </React.Fragment>
                                        ) : (
                                          props.t(subItem.label)
                                        )}
                                      </Link>
                                    </li>
                                  ) : (
                                    <li className="nav-item">
                                      <Link
                                        onClick={subItem.click}
                                        className="nav-link"
                                        to="/#"
                                        data-bs-toggle="collapse">
                                        {subItem.icon != null ? (
                                          <React.Fragment>
                                            <i className={subItem.icon}></i>{' '}
                                            <span>
                                              {props.t(subItem.label)}
                                            </span>
                                          </React.Fragment>
                                        ) : (
                                          props.t(subItem.label)
                                        )}
                                      </Link>
                                      <Collapse
                                        className="menu-dropdown"
                                        in={subItem.stateVariables}>
                                        <ul
                                          className="nav nav-sm flex-column"
                                          id="sidebarEcommerce">
                                          {/* child subItms  */}
                                          {subItem.childItems?.map(
                                            (
                                              subChildItem: any,
                                              key: number,
                                            ) => (
                                              <React.Fragment key={key}>
                                                {subChildItem.isChildItem ===
                                                null ? (
                                                  <li className="nav-item">
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
                                                ) : (
                                                  <li className="nav-item">
                                                    <Link
                                                      onClick={
                                                        subChildItem.click
                                                      }
                                                      className="nav-link"
                                                      to="/#"
                                                      data-bs-toggle="collapse">
                                                      {' '}
                                                      {props.t(
                                                        subChildItem.label,
                                                      )}
                                                    </Link>
                                                    <Collapse
                                                      className="menu-dropdown"
                                                      in={
                                                        subChildItem.stateVariables
                                                      }>
                                                      <ul
                                                        className="nav nav-sm flex-column"
                                                        id="sidebarEcommerce">
                                                        {/* child subItms  */}
                                                        {subChildItem.childItems?.map(
                                                          (
                                                            subSubChildItem: any,
                                                            key: number,
                                                          ) => (
                                                            <React.Fragment
                                                              key={key}>
                                                              {subSubChildItem.childItems !=
                                                              null ? (
                                                                <li
                                                                  className="nav-item apex"
                                                                  key={key}>
                                                                  <Link
                                                                    to={
                                                                      subSubChildItem.link ??
                                                                      '/#'
                                                                    }
                                                                    className="nav-link"
                                                                    onClick={
                                                                      subSubChildItem.click
                                                                    }
                                                                    data-bs-toggle="collapse">
                                                                    {props.t(
                                                                      subSubChildItem.label,
                                                                    )}
                                                                  </Link>
                                                                  {subSubChildItem.isChildItem !=
                                                                    null && (
                                                                    <Collapse
                                                                      className="collapse menu-dropdown"
                                                                      in={
                                                                        subSubChildItem.stateVariables
                                                                      }>
                                                                      <ul className="nav nav-sm flex-column">
                                                                        {subSubChildItem.childItems?.map(
                                                                          (
                                                                            subSubChildItem: any,
                                                                            key: number,
                                                                          ) => (
                                                                            <li
                                                                              className="nav-item"
                                                                              key={
                                                                                key
                                                                              }>
                                                                              <Link
                                                                                to={
                                                                                  subSubChildItem.link ??
                                                                                  '/#'
                                                                                }
                                                                                className="nav-link">
                                                                                {props.t(
                                                                                  subSubChildItem.label,
                                                                                )}
                                                                              </Link>
                                                                            </li>
                                                                          ),
                                                                        )}
                                                                      </ul>
                                                                    </Collapse>
                                                                  )}
                                                                </li>
                                                              ) : (
                                                                <li className="nav-item">
                                                                  <Link
                                                                    to={
                                                                      subSubChildItem.link ??
                                                                      '/#'
                                                                    }
                                                                    className="nav-link">
                                                                    {props.t(
                                                                      subSubChildItem.label,
                                                                    )}
                                                                  </Link>
                                                                </li>
                                                              )}
                                                            </React.Fragment>
                                                          ),
                                                        )}
                                                      </ul>
                                                    </Collapse>
                                                  </li>
                                                )}
                                              </React.Fragment>
                                            ),
                                          )}
                                        </ul>
                                      </Collapse>
                                    </li>
                                  )}
                                </React.Fragment>
                              ) : (
                                <li className="menu-title">
                                  <span data-key="t-menu">
                                    {props.t(item.label)}
                                  </span>
                                </li>
                              )}
                            </React.Fragment>
                          ))}
                        </ul>
                      )}
                    </Collapse>
                  </li>
                )}
                {item.subItems == null && (
                  <li className="nav-item">
                    <Link className="nav-link menu-link" to={item.link ?? '/#'}>
                      <i className={item.icon}></i>{' '}
                      <span>{props.t(item.label)}</span>
                    </Link>
                  </li>
                )}
              </>
            ) : (
              <li className="menu-title">
                <span data-key="t-menu">{props.t(item.label)}</span>
              </li>
            )}
          </React.Fragment>
        );
      })}
      {/* menu Items */}
    </React.Fragment>
  );
};

HorizontalLayout.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(HorizontalLayout));
