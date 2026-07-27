import React from 'react';

// import Scss
import './assets/scss/themes.scss';

// imoprt Route
import Route from './Routes/Index';

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = (): React.JSX.Element => {
  return (
    <React.Fragment>
      <Route />
      <ToastContainer />
    </React.Fragment>
  );
};

export default App;
