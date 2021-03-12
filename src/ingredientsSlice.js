import { createSlice } from '@reduxjs/toolkit';

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    searchTerm: '',
    filters: [],
  },
  reducers: {
    addSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    addFilter: (state, action) => {
      !state.filters.includes(action.payload) &&
        state.filters.push(action.payload.toLowerCase());
    },
    deleteFilter: (state, action) => {
      state.filters = state.filters.filter(
        (filterName) => filterName !== action.payload,
      );
    },
    clearFilters: (state) => {
      state.filters = [];
    },
  },
});

export const {
  addSearchTerm,
  addFilter,
  deleteFilter,
  clearFilters,
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
