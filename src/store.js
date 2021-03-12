import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice.js';
import resultsReducer from './resultsSlice.js';

export default configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    results: resultsReducer,
  },
});
