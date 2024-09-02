import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as chickenApi from '../../api/chickenApi';

export const addChicken = createAsyncThunk(
  'chickens/addChicken',
  async (chickenData, { getState }) => {
    const { auth } = getState();
    const farmId = auth.user.farmId;
    const response = await chickenApi.addChicken(farmId, chickenData);
    return response;
  }
);

const chickenSlice = createSlice({
  name: 'chickens',
  initialState: {
    chickens: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addChicken.pending, state => {
        state.loading = true;
      })
      .addCase(addChicken.fulfilled, (state, action) => {
        state.chickens.push(action.payload);
        state.loading = false;
      })
      .addCase(addChicken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default chickenSlice.reducer;
