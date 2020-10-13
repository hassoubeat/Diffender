import { combineReducers } from "redux";
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import userReducer from './userSlice';
import domainReducer from './domainSlice';

const combineReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  domain: domainReducer
});

// 全Stateの初期化用Reducer
const rootReducer = (state, action) => {
  if (action.type === "logout") {
      state = undefined;
  }
  return combineReducer(state, action);
};

export default configureStore({
  reducer: rootReducer
});