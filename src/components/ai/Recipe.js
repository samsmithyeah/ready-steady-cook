import { Button, Grid, CircularProgress } from '@material-ui/core';
import TypingTitle from '../common/TypingTitle';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

export default function Recipe(props) {
  const { handleRestartClick } = props;
  const [recipeLatestVersion, setRecipeLatestVersion] = useState(null);
  const [ingredientsLatestVersion, setIngredientsLatestVersion] = useState([]);
  const { uuid } = useParams();

  async function fetchRecipeByUUID(uuid) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', uuid)
      .single();

    if (error) {
      console.error('Error fetching recipe:', error);
      return null;
    }
    return data;
  }

  const { imgURL, recipe } = useSelector((state) => state.recipe);
  const { ingredients } = useSelector((state) => state.input);

  useEffect(() => {
    async function fetchAndSetRecipeData() {
      if (!recipe.length && uuid) {
        const data = await fetchRecipeByUUID(uuid);
        setRecipeLatestVersion(data);
      } else if (recipe.length > 0) {
        setRecipeLatestVersion(JSON.parse(recipe));
      } else {
        console.log('how did we end up here?');
      }
    }

    fetchAndSetRecipeData();
  }, [uuid, recipe, ingredients]);

  useEffect(() => {
    if (ingredients.length > 0) {
      setIngredientsLatestVersion(ingredients);
      console.log('ingredientsLatestVersion1', ingredientsLatestVersion);
    } else if (recipeLatestVersion) {
      setIngredientsLatestVersion(recipeLatestVersion.input_ingredients);
      console.log('ingredientsLatestVersion2', ingredientsLatestVersion);
    } else {
      console.log('how did we end up here?');
    }
  }, [ingredients, ingredientsLatestVersion, recipeLatestVersion]);

  function resultsHeading() {
    if (ingredientsLatestVersion.length === 0) {
      return 'Something went wrong. No ingredients found. Please try again.';
    } else if (ingredientsLatestVersion.length === 1) {
      return `With your ${ingredientsLatestVersion[0].toLowerCase()} you could make...`;
    } else if (ingredientsLatestVersion.length === 2) {
      return `With your ${ingredientsLatestVersion[0].toLowerCase()} and ${ingredientsLatestVersion[1].toLowerCase()} you could make...`;
    } else {
      return `With your ${ingredientsLatestVersion[0].toLowerCase()}, ${ingredientsLatestVersion
        .slice(1, -1)
        .join(', ')} and ${ingredientsLatestVersion.slice(
        -1,
      )} you could make...`;
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
          {ingredientsLatestVersion.length > 0 && (
            <TypingTitle text={resultsHeading()} />
          )}
          <br />
        </Grid>
        {!recipeLatestVersion ? (
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
              <h1>{recipeLatestVersion.title}</h1>
              <p>
                <strong>Prep Time:</strong> {recipeLatestVersion.prep_time}
                <br />
                <strong>Cook Time:</strong> {recipeLatestVersion.cook_time}
                <br />
                <strong>Total Time:</strong> {recipeLatestVersion.total_time}
                <br />
                <strong>Servings:</strong> {recipeLatestVersion.servings}
              </p>
              <p>{recipeLatestVersion.description}</p>
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
                {recipeLatestVersion.ingredients.map((ingredient) => {
                  return <li key={ingredient}>{ingredient}</li>;
                })}
              </ul>
            </Grid>
            <Grid item xs={12}>
              <h2>Method</h2>
              <ol>
                {recipeLatestVersion.method.map((step) => {
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
