import React, {type ReactNode, useEffect} from 'react';

// import actions
import {
  changeLayout,
  changeSidebarTheme,
  changeLayoutMode,
  changeLayoutWidth,
  changeLayoutPosition,
  changeTopbarTheme,
  changeLeftsidebarSizeType,
  changeLeftsidebarViewType,
  changeSidebarImageType,
  changeBodyImageType,
} from 'slices/thunk';

// redux
import {useSelector, useDispatch} from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import {createSelector} from 'reselect';

interface LayoutProps {
  children: ReactNode;
}
const Layout = ({children}: LayoutProps): React.JSX.Element => {
  const dispatch: any = useDispatch();

  const selectProperties = createSelector(
    (state: any) => state.Layout,
    layout => ({
      layoutType: layout.layoutType,
      leftSidebarType: layout.leftSidebarType,
      layoutModeType: layout.layoutModeType,
      layoutWidthType: layout.layoutWidthType,
      layoutPositionType: layout.layoutPositionType,
      topbarThemeType: layout.topbarThemeType,
      leftsidbarSizeType: layout.leftsidbarSizeType,
      leftSidebarViewType: layout.leftSidebarViewType,
      leftSidebarImageType: layout.leftSidebarImageType,
      bodyImageType: layout.bodyImageType,
    }),
  );
  const {
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
    bodyImageType,
  } = useSelector(selectProperties);

  /*
    layout settings
    */
  useEffect(() => {
    if (
      Boolean(layoutType) ||
      Boolean(leftSidebarType) ||
      Boolean(layoutModeType) ||
      Boolean(layoutWidthType) ||
      Boolean(layoutPositionType) ||
      Boolean(topbarThemeType) ||
      Boolean(leftsidbarSizeType) ||
      Boolean(leftSidebarViewType) ||
      Boolean(leftSidebarImageType) ||
      Boolean(bodyImageType)
    ) {
      window.dispatchEvent(new Event('resize'));
      dispatch(changeLeftsidebarViewType(leftSidebarViewType));
      dispatch(changeLeftsidebarSizeType(leftsidbarSizeType));
      dispatch(changeLayoutMode(layoutModeType));
      dispatch(changeSidebarTheme(leftSidebarType));
      dispatch(changeLayoutWidth(layoutWidthType));
      dispatch(changeLayoutPosition(layoutPositionType));
      dispatch(changeTopbarTheme(topbarThemeType));
      dispatch(changeLayout(layoutType));
      dispatch(changeSidebarImageType(leftSidebarImageType));
      dispatch(changeBodyImageType(bodyImageType));
    }
  }, [
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
    bodyImageType,
    dispatch,
  ]);

  return (
    <React.Fragment>
      <div id="layout-wrapper">
        <Header />
        <Sidebar layoutType={layoutType} />
        <div className="main-content">
          {children}
          <Footer />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
