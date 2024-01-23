import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {apiMobile} from '../../services/baseService';

const initialState = {
  showRealApp: false,
};

export const introSlice = createSlice({
  name: 'intro',
  initialState,
  reducers: {
    setShowRealApp: (state, action) => {
      state.showRealApp = true;
    },
  },
});

export const {setShowRealApp} = introSlice.actions;

export default introSlice.reducer;
