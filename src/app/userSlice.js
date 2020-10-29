import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isUserInitializeComplete: false,
    isLogin: false,
    currentUser: {},
    currentUserOption: {}
  },
  reducers: {
    setIsUserInitializeComplete: (state, action) => {
      state.isUserInitializeComplete = action.payload;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setCurrentUserOption: (state, action) => {
      state.currentUserOption = action.payload;
    },
    setProjectsSortMap: (state, action) => {
      _.set(state.currentUserOption, "projectsSortMap", action.payload);
    },
  },
});

// ActionCreaterのエクスポート
export const { 
  setIsUserInitializeComplete, 
  setIsLogin, 
  setCurrentUser, 
  setCurrentUserOption,
  setProjectsSortMap  
} = userSlice.actions;

// ステートをuseSelectorフックから呼び出し可能に
export const selectIsUserInitializeComplete = (state) => state.user.isUserInitializeComplete;
export const selectIsLogin = (state) => state.user.isLogin;
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectCurrentUserOption = (state) => state.user.currentUserOption;
export const selectProjectSortMap = (state) => {
  return _.get(state.user.currentUserOption, "projectsSortMap", {});
}

// Reducerのエクスポート
export default userSlice.reducer;
