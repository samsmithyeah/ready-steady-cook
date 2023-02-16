import { configureStore } from '@reduxjs/toolkit';
import inputReducer from './ai/inputSlice.js';
import recipeReducer from './ai/recipeSlice.js';
import ingredientsReducer from './legacy/ingredientsSlice.js';
import resultsReducer from './legacy/resultsSlice.js';

export default configureStore({
  reducer: {
    input: inputReducer,
    recipe: recipeReducer,
    ingredients: ingredientsReducer,
    results: resultsReducer,
  },
});
