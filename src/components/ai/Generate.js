import {
  Button,
  TextField,
  Grid,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import TypingTitle from '../common/TypingTitle.js';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generate } from '../../redux/ai/recipeSlice.js';
import { addCuisineType } from '../../redux/ai/inputSlice.js';

export default function Generate(props) {
  const { handleRestartClick, history, setIsNewRecipe } = props;
  const { ingredients, cuisineType } = useSelector((state) => state.input);
  const [customType, setCustomType] = useState(false);
  const inputEl = useRef(null);
  const { REACT_APP_RECIPE_URL } = process.env;

  useEffect(() => {
    if (customType) {
      inputEl.current.focus();
    }
  }, [customType]);

  const dispatch = useDispatch();

  async function handleGenerateRecipe(event) {
    event.preventDefault();
    setIsNewRecipe(true);
    const uuid = uuidv4();
    history.push(`/recipe/${uuid}`);
    try {
      const response = await fetch(REACT_APP_RECIPE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients, cuisineType, uuid }),
      });
      const { recipe } = await response.json();
      dispatch(generate(recipe));
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
      <form noValidate autoComplete="off" onSubmit={handleGenerateRecipe}>
        <Grid
          container
          style={{
            height: '80vh',
            justifyContent: 'center',
          }}
        >
          <Grid item xs={12}>
            <TypingTitle text="What sort of thing do you fancy?" />
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              onClick={handleRestartClick}
              endIcon={<AutorenewIcon />}
              style={{
                position: 'absolute',
                bottom: 5,
              }}
            >
              Start again
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
