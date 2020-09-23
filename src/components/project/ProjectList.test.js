import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../app/store';
import ProjectList from './ProjectList';

test('renders without crashing', () => {
  render(
    <Provider store={store}>
      <ProjectList />
    </Provider>
  );
});