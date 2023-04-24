import { Button, Grid, CircularProgress } from '@material-ui/core';
import TypingTitle from '../common/TypingTitle';
import ChatWidget from './ChatWidget';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import TwitterIcon from '@material-ui/icons/Twitter';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

export default function Recipe(props) {
  const {
    handleRestartClick,
    handleGenerateImage,
    isNewRecipe,
    recipeLatestVersion,
    setRecipeLatestVersion,
    ingredientsLatestVersion,
    setIngredientsLatestVersion,
    isError,
    setIsError,
    setActiveStep,
    classes,
    history,
    setIsNewRecipe,
    conversation,
    setConversation,
  } = props;
  const { uuid } = useParams();

  const { imgURL, recipe } = useSelector((state) => state.recipe);
  const { ingredients, cuisineType } = useSelector((state) => state.input);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [isUpdatedRecipe, setIsUpdatedRecipe] = useState(false);

  useEffect(() => {
    async function fetchRecipeByUUID(uuid) {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', uuid)
        .single();

      if (error) {
        setIsError(true);
        console.error('Error fetching recipe:', error);
        return null;
      }
      return data;
    }
    async function fetchAndSetRecipeData() {
      if (!isNewRecipe && uuid) {
        const data = await fetchRecipeByUUID(uuid);
        setRecipeLatestVersion(data);
        setActiveStep(3);
      } else if (!isUpdatedRecipe && Object.keys(recipe).length > 0) {
        setRecipeLatestVersion({
          ...recipe,
          input_ingredients: ingredientsLatestVersion,
        });
        setActiveStep(3);
      }
    }

    fetchAndSetRecipeData();
  }, [
    uuid,
    recipe,
    ingredients,
    isNewRecipe,
    setRecipeLatestVersion,
    setIsError,
    setActiveStep,
    cuisineType,
    ingredientsLatestVersion,
    isUpdatedRecipe,
  ]);

  useEffect(() => {
    if (isNewRecipe) {
      setIngredientsLatestVersion(ingredients);
    } else if (!isNewRecipe && recipeLatestVersion) {
      setIngredientsLatestVersion(recipeLatestVersion.input_ingredients);
    }
  }, [
    ingredients,
    ingredientsLatestVersion,
    isNewRecipe,
    recipeLatestVersion,
    setIngredientsLatestVersion,
  ]);

  useEffect(() => {
    if (!imgURL && recipeLatestVersion) {
      //handleGenerateImage(recipeLatestVersion.title);
    }
  }, [imgURL, recipeLatestVersion, handleGenerateImage]);

  useEffect(() => {
    if (recipeLatestVersion) {
      setShowChatWidget(true);
    }
  }, [recipeLatestVersion]);

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

  function createTweet() {
    const recipeTitle = encodeURIComponent(recipeLatestVersion.title);
    const url = window.location.href;
    const ingredientsHashtags = ingredientsLatestVersion
      .map((ingredient) =>
        encodeURIComponent(ingredient.toLowerCase().replace(/\s+/g, '')),
      )
      .join(',');
    const hashtags = `recipe,cooking,ai,${ingredientsHashtags}`;
    const text = `Check out this delicious AI generated recipe for ${recipeTitle}!`;

    return `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;
  }

  function handleShareClick() {
    const tweetUrl = createTweet();
    window.open(tweetUrl, '_blank');
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
        {isError ? (
          <TypingTitle text={resultsHeading()} />
        ) : !recipeLatestVersion ? (
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
                <strong>Prep Time:</strong>{' '}
                {recipeLatestVersion.prep_time || recipeLatestVersion.prepTime}
                <br />
                <strong>Cook Time:</strong>{' '}
                {recipeLatestVersion.cook_time || recipeLatestVersion.cookTime}
                <br />
                <strong>Total Time:</strong>{' '}
                {recipeLatestVersion.total_time ||
                  recipeLatestVersion.totalTime}
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
              <Button
                className={classes.twitterButton}
                onClick={handleShareClick}
                startIcon={<TwitterIcon />}
              >
                Share recipe on Twitter
              </Button>
            </Grid>
            {showChatWidget && (
              <ChatWidget
                classes={classes}
                recipeLatestVersion={recipeLatestVersion}
                setRecipeLatestVersion={setRecipeLatestVersion}
                history={history}
                setIsNewRecipe={setIsNewRecipe}
                conversation={conversation}
                setConversation={setConversation}
                data-testid="chat-widget"
                setIsUpdatedRecipe={setIsUpdatedRecipe}
              />
            )}
          </>
        )}
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Button onClick={handleRestartClick} endIcon={<AutorenewIcon />}>
            Start again
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
