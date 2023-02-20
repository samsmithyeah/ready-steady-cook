import { createSlice } from '@reduxjs/toolkit';

export const recipeSlice = createSlice({
  name: 'recipe',
  initialState: {
    recipe: {},
    imgURL: '',
  },
  reducers: {
    generate: (state, action) => {
      state.recipe = action.payload;
    },
    generateImage: (state, action) => {
      state.imgURL = action.payload;
    },
  },
});

export const { generate, generateImage } = recipeSlice.actions;

export default recipeSlice.reducer;
