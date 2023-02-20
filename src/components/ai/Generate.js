import {
  Button,
  TextField,
  Typography,
  Box,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { generate, generateImage } from '../../redux/ai/recipeSlice.js';
import { addCuisineType } from '../../redux/ai/inputSlice.js';

export default function Generate(props) {
  const { history, setIsLoading, classes, handleRestartClick } = props;
  const { ingredients, cuisineType } = useSelector((state) => state.input);
  const [customType, setCustomType] = useState(false);
  const inputEl = useRef(null);
  const { REACT_APP_RECIPE_URL, REACT_APP_IMAGE_URL } = process.env;

  useEffect(() => {
    if (customType) {
      inputEl.current.focus();
    }
  }, [customType]);

  const dispatch = useDispatch();

  async function handleGenerateRecipe(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(REACT_APP_RECIPE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients, cuisineType }),
      });
      const { recipe } = await response.json();
      dispatch(generate(recipe));
      const recipeJSON = JSON.parse(recipe);
      setIsLoading(false);
      history.push('/recipe');
      await handleGenerateImage(recipeJSON.title);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
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

  function handleCustomToggle(event) {
    if (event.target.value === 'custom') {
      setCustomType(true);
    } else {
      dispatch(addCuisineType(''));
      setCustomType(false);
    }
  }

  function handleSetCuisineType(event) {
    dispatch(addCuisineType(event.target.value.trim()));
  }

  return (
    <>
      <form
        noValidate
        className={classes.root}
        autoComplete="off"
        onSubmit={handleGenerateRecipe}
      >
        <Typography variant="h4" gutterBottom>
          What sort of thing do you fancy?
        </Typography>
        <Box height={200}>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="select cuisine type"
              name="cuisineType"
              onChange={handleCustomToggle}
              defaultValue="default"
            >
              <FormControlLabel
                value="default"
                control={<Radio />}
                label="I don't care"
                checked={!customType}
              />
              <FormControlLabel
                value="custom"
                control={<Radio />}
                label="This please:"
                checked={customType}
              />
              <FormControlLabel
                disabled={!customType}
                control={
                  <TextField
                    inputProps={{ 'aria-label': 'cuisine-type' }}
                    onChange={handleSetCuisineType}
                    inputRef={inputEl}
                    onClick={() => setCustomType(true)}
                  />
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box height={200}>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            endIcon={<SendIcon />}
            disabled={customType && !cuisineType}
            disableElevation
          >
            Generate a recipe
          </Button>
        </Box>
      </form>
      <Button onClick={handleRestartClick} endIcon={<AutorenewIcon />}>
        Start again
      </Button>
    </>
  );
}
