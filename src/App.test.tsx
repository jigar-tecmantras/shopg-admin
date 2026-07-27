import React from 'react';
import {render} from '@testing-library/react';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from 'store';

describe('YourComponent', () => {
  test('renders without Crashing', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>,
    );
  });
});
