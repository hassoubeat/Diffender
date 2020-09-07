import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loginUser: {
      isLogin: true,
      name: "nanashi"
    },
  },
  reducers: {
    setLoginUser: (state, action) => {
      state.loginUser = action.payload;
    }
  },
});

// ActionCreaterのエクスポート
export const { setLoginUser } = userSlice.actions;

// ステートをuseSelectorフックから呼び出し可能に
export const selectLoginUser = (state) => state.user.loginUser;

// Reducerのエクスポート
export default userSlice.reducer;
