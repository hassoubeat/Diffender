import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isInitialize: true,
    isLogin: false,
    currentUser: {},
    currentUserOption: {}
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
    setCurrentUserOption: (state, action) => {
      state.currentUserOption = action.payload;
    },
  },
});

// ActionCreaterのエクスポート
export const { setIsInitialize, setIsLogin, setCurrentUser, setCurrentUserOption } = userSlice.actions;

// ステートをuseSelectorフックから呼び出し可能に
export const selectIsInitialize = (state) => state.user.isInitialize;
export const selectIsLogin = (state) => state.user.isLogin;
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectCurrentUserOption = (state) => state.user.currentUserOption;

// Reducerのエクスポート
export default userSlice.reducer;
