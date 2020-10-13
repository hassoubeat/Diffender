import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import userReducer from './userSlice';
import domainReducer from './domainSlice';

export default configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    domain: domainReducer
  },
});
