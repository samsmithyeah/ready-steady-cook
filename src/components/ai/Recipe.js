import { Button, Grid, CircularProgress } from '@material-ui/core';
import TypingTitle from '../common/TypingTitle';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useSelector } from 'react-redux';

export default function Recipe(props) {
  const { handleRestartClick } = props;

  const { imgURL, recipe } = useSelector((state) => state.recipe);
  const { ingredients } = useSelector((state) => state.input);

  function waitForRecipe() {
    if (recipe.length > 0) {
      return JSON.parse(recipe);
    } else {
      setTimeout(waitForRecipe, 250);
    }
  }
  const recipeJSON = waitForRecipe();

  function resultsHeading() {
    if (ingredients.length === 0) {
      return 'Something went wrong. No ingredients found. Please try again.';
    } else if (ingredients.length === 1) {
      return `With your ${ingredients[0].toLowerCase()} you could make...`;
    } else if (ingredients.length === 2) {
      return `With your ${ingredients[0].toLowerCase()} and ${ingredients[1].toLowerCase()} you could make...`;
    } else {
      return `With your ${ingredients[0].toLowerCase()}, ${ingredients
        .slice(1, -1)
        .join(', ')} and ${ingredients.slice(-1)} you could make...`;
    }
  }

  return (
    <div>
      <Grid
        container
        style={{
          textAlign: 'left',
          alignItems: 'flex-start',
        }}
      >
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <TypingTitle text={resultsHeading()} />
          <br />
        </Grid>
        {!recipeJSON ? (
          <Grid
            item
            xs={12}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '68vh',
            }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sm={6}>
              <h1>{recipeJSON.title}</h1>
              <p>
                <strong>Prep Time:</strong> {recipeJSON.prepTime}
                <br />
                <strong>Cook Time:</strong> {recipeJSON.cookTime}
                <br />
                <strong>Total Time:</strong> {recipeJSON.totalTime}
                <br />
                <strong>Servings:</strong> {recipeJSON.servings}
              </p>
              <p>{recipeJSON.description}</p>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {!imgURL ? (
                <CircularProgress />
              ) : (
                <img src={imgURL} alt="The recipe" />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <h2>Ingredients</h2>
              <ul>
                {recipeJSON.ingredients.map((ingredient) => {
                  return <li key={ingredient}>{ingredient}</li>;
                })}
              </ul>
            </Grid>
            <Grid item xs={12}>
              <h2>Method</h2>
              <ol>
                {recipeJSON.method.map((step) => {
                  return <li key={step}>{step}</li>;
                })}
              </ol>
            </Grid>
            <Grid
              item
              xs={12}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Button onClick={handleRestartClick} endIcon={<AutorenewIcon />}>
                Start again
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
}
