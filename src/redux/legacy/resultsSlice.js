import { createSlice } from '@reduxjs/toolkit';

export const resultsSlice = createSlice({
  name: 'results',
  initialState: {
    unfilteredResults: [],
    filteredResults: [],
  },
  reducers: {
    search: (state, action) => {
      state.unfilteredResults = action.payload;
    },
    filter: (state, action) => {
      state.filteredResults = action.payload;
    },
  },
});

export const { search, filter } = resultsSlice.actions;

export default resultsSlice.reducer;
