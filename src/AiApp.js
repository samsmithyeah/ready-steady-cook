import { Route, Switch } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import Generate from './components/ai/Generate';
import Recipe from './components/ai/Recipe';
import ChooseIngredients from './components/ai/Ingredients';
import Progress from './components/common/Progress';
import { clearIngredients, addCuisineType } from './redux/ai/inputSlice.js';
import { generate, generateImage } from './redux/ai/recipeSlice';

export default function AiApp(props) {
  const {
    classes,
    isLoading,
    setIsLoading,
    inputRef,
    history,
    activeStep,
    setActiveStep,
  } = props;

  const { REACT_APP_IMAGE_URL } = process.env;

  const [isNewRecipe, setIsNewRecipe] = useState(false);
  const [customType, setCustomType] = useState(false);
  const [recipeLatestVersion, setRecipeLatestVersion] = useState(null);
  const [ingredientsLatestVersion, setIngredientsLatestVersion] = useState([]);
  const [isError, setIsError] = useState(false);

  const steps = ['Choose ingredients', 'Choose cuisine type', 'Recipe'];

  const dispatch = useDispatch();

  function handleRestartClick() {
    dispatch(addCuisineType(''));
    dispatch(clearIngredients());
    dispatch(generate({}));
    dispatch(generateImage(''));
    setCustomType(false);
    setRecipeLatestVersion(null);
    setIngredientsLatestVersion([]);
    setIsError(false);
    setIsNewRecipe(false);
    history.push('/');
  }

  async function handleGenerateImage(recipeTitle) {
    try {
      const response = await fetch(REACT_APP_IMAGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipeTitle }),
      });
      const { imageURL } = await response.json();
      dispatch(generateImage(imageURL));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Progress activeStep={activeStep} steps={steps} />
      <Switch>
        <Route exact path="/">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <ChooseIngredients
              history={history}
              inputRef={inputRef}
              setIsLoading={setIsLoading}
              handleRestartClick={handleRestartClick}
              classes={classes}
            />
          )}
        </Route>
        <Route exact path="/cuisine">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Generate
              classes={classes}
              handleRestartClick={handleRestartClick}
              setIsLoading={setIsLoading}
              history={history}
              inputRef={inputRef}
              handleGenerateImage={handleGenerateImage}
              setIsNewRecipe={setIsNewRecipe}
              customType={customType}
              setCustomType={setCustomType}
              setRecipeLatestVersion={setRecipeLatestVersion}
              setIsError={setIsError}
              setActiveStep={setActiveStep}
            />
          )}
        </Route>
        <Route path="/recipe/:uuid">
          <Recipe
            handleRestartClick={handleRestartClick}
            handleGenerateImage={handleGenerateImage}
            isNewRecipe={isNewRecipe}
            recipeLatestVersion={recipeLatestVersion}
            setRecipeLatestVersion={setRecipeLatestVersion}
            ingredientsLatestVersion={ingredientsLatestVersion}
            setIngredientsLatestVersion={setIngredientsLatestVersion}
            isError={isError}
            setIsError={setIsError}
            setActiveStep={setActiveStep}
            classes={classes}
          />
        </Route>
      </Switch>
    </>
  );
}
