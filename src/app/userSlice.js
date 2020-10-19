import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isInitialize: true,
    isLogin: false,
    currentUser: {},
    currentUserOptions: {}
  },
  reducers: {
    setIsInitialize: (state, action) => {
      state.isInitialize = action.payload;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setCurrentUserOptions: (state, action) => {
      state.currentUserOptions = action.payload;
    },
  },
});

// ActionCreaterのエクスポート
export const { setIsInitialize, setIsLogin, setCurrentUser, setCurrentUserOptions } = userSlice.actions;

// ステートをuseSelectorフックから呼び出し可能に
export const selectIsInitialize = (state) => state.user.isInitialize;
export const selectIsLogin = (state) => state.user.isLogin;
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectCurrentUserOptions = (state) => state.user.currentUserOptions;

// Reducerのエクスポート
export default userSlice.reducer;
