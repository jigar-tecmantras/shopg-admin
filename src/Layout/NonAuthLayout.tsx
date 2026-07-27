import React, {useEffect} from 'react';

// redux
import {useSelector} from 'react-redux';
import {createSelector} from 'reselect';

interface NonAuthLayoutProps {
  children: React.ReactNode | React.ReactNode[];
}
const NonAuthLayout = (props: NonAuthLayoutProps): React.JSX.Element => {
  const selectProperties = createSelector(
    (state: any) => state.Layout,
    layout => ({
      layoutModeType: layout.layoutModeType,
    }),
  );
  const {layoutModeType} = useSelector(selectProperties);

  useEffect(() => {
    if (layoutModeType === 'dark') {
      document.body.setAttribute('data-bs-theme', 'dark');
    } else {
      document.body.setAttribute('data-bs-theme', 'light');
    }
    return () => {
      document.body.removeAttribute('data-bs-theme');
    };
  }, [layoutModeType]);
  return (
    <React.Fragment>
      <div>{props.children}</div>
    </React.Fragment>
  );
};

export default NonAuthLayout;
