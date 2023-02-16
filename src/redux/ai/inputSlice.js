import { createSlice } from '@reduxjs/toolkit';

export const inputSlice = createSlice({
  name: 'input',
  initialState: {
    ingredients: [],
    cuisineType: '',
  },
  reducers: {
    addIngredient: (state, action) => {
      !state.ingredients.includes(action.payload) &&
        state.ingredients.push(action.payload.toLowerCase());
    },
    deleteIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (ingredientName) => ingredientName !== action.payload,
      );
    },
    clearIngredients: (state) => {
      state.ingredients = [];
    },
    addCuisineType: (state, action) => {
      state.cuisineType = action.payload;
    },
  },
});

export const {
  addIngredient,
  deleteIngredient,
  clearIngredients,
  addCuisineType,
} = inputSlice.actions;

export default inputSlice.reducer;
