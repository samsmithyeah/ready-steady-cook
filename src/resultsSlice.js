import { createSlice } from '@reduxjs/toolkit';

export const resultsSlice = createSlice({
  name: 'results',
  initialState: {
    unfiltered: [],
    filtered: [],
  },
  reducers: {
    search: (state, action) => {
      state.unfiltered = action.payload;
    },
    filter: (state, action) => {
      state.filtered = action.payload;
    },
  },
});

export const { search, filter } = resultsSlice.actions;

export default resultsSlice.reducer;
