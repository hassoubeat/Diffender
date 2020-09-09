import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';

test('renders without crashing', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(getByText(/Diffender/i)).toBeInTheDocument();
});