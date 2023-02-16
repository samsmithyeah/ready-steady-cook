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
import { generate } from '../../redux/ai/recipeSlice.js';
import { addCuisineType } from '../../redux/ai/inputSlice.js';

export default function Generate(props) {
  const { history, setIsLoading, classes, handleRestartClick } = props;
  const { ingredients, cuisineType } = useSelector((state) => state.input);
  const [customType, setCustomType] = useState(false);
  const inputEl = useRef(null);

  useEffect(() => {
    if (customType) {
      inputEl.current.focus();
    }
  }, [customType]);

  const dispatch = useDispatch();

  async function handleGenerateRecipe(event) {
    event.preventDefault();
    setIsLoading(true);
    const response = await fetch('http://localhost:3001/generate-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients, cuisineType }),
    });
    const { recipe } = await response.json();
    dispatch(generate(recipe));
    setIsLoading(false);
    history.push('/recipe');
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
              />
              <FormControlLabel
                value="custom"
                control={<Radio />}
                label="This please:"
              />
              <FormControlLabel
                disabled={!customType}
                control={
                  <TextField
                    inputProps={{ 'aria-label': 'cuisine-type' }}
                    onChange={handleSetCuisineType}
                    inputRef={inputEl}
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