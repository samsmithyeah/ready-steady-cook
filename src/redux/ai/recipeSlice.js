import { createSlice } from '@reduxjs/toolkit';

export const recipeSlice = createSlice({
  name: 'recipe',
  initialState: {
    recipe: '',
  },
  reducers: {
    generate: (state, action) => {
      state.recipe = action.payload;
    },
  },
});

export const { generate } = recipeSlice.actions;

export default recipeSlice.reducer;
