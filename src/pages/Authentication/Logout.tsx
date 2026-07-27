import {DOCUMENT_TITLE} from 'Common/constants/layout';
import Cookies from 'js-cookie';
import React from 'react';

// redux
import {variables} from 'utils/constant';

const Logout = (): React.JSX.Element => {
  document.title = DOCUMENT_TITLE.LOG_OUT;

  Cookies.remove(variables.ecommerce_admin);

  window.location.reload();

  // Return null since this component doesn't render any UI
  return <></>;
};

export default Logout;
