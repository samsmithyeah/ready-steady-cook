import { Button, Grid } from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useSelector } from 'react-redux';

export default function Recipe(props) {
  const { handleRestartClick, classes } = props;

  const { recipe } = useSelector((state) => state.recipe);
  const recipeJSON = JSON.parse(recipe);
  console.log(recipeJSON);

  return (
    <div className={classes.root}>
      <Grid container style={{ textAlign: 'left' }}>
        <Grid item>
          <h1>{recipeJSON.title}</h1>
        </Grid>
        <Grid item xs={12}>
          <p>
            <strong>Prep Time:</strong> {recipeJSON.prepTime}
            <br />
            <strong>Cook Time:</strong> {recipeJSON.cookTime}
            <br />
            <strong>Total Time:</strong> {recipeJSON.totalTime}
            <br />
            <strong>Servings:</strong> {recipeJSON.servings}
          </p>
        </Grid>
        <Grid item>
          <p>{recipeJSON.description}</p>
        </Grid>
        <Grid item xs={12}>
          <h2>Ingredients</h2>
          <ul>
            {recipeJSON.ingredients.map((ingredient) => {
              return <li key={ingredient}>{ingredient}</li>;
            })}
          </ul>
        </Grid>
        <Grid item>
          <h2>Method</h2>
          <ol>
            {recipeJSON.method.map((step) => {
              return <li key={step}>{step}</li>;
            })}
          </ol>
        </Grid>
      </Grid>
      <Button onClick={handleRestartClick} endIcon={<AutorenewIcon />}>
        Start again
      </Button>
    </div>
  );
}
