import { Button, TextField, IconButton, Grid, Box } from '@material-ui/core';
import FilterChips from '../common/FilterChips.js';
import TypingTitle from '../common/TypingTitle.js';
import AddIcon from '@material-ui/icons/Add';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useSelector, useDispatch } from 'react-redux';
import { addIngredient, deleteIngredient } from '../../redux/ai/inputSlice.js';
import { useState } from 'react';

export default function ChooseIngredients(props) {
  const {
    history,
    inputRef,
    setIsLoading,
    handleRestartClick,
    classes,
  } = props;
  const [newIngredient, setNewIngredient] = useState('');
  const { ingredients } = useSelector((state) => state.input);
  const dispatch = useDispatch();

  function handleAddIngredient(event) {
    event.preventDefault();
    dispatch(addIngredient(newIngredient.trim()));
    setNewIngredient('');
  }

  function handleDeleteIngredient(ingredientToDelete) {
    dispatch(deleteIngredient(ingredientToDelete));
  }

  function handleGoToNextPage() {
    setIsLoading(true);
    history.push('/cuisine');
    setIsLoading(false);
  }

  return (
    <>
      <Grid container style={{ height: '80vh' }}>
        <Grid item xs={12}>
          <TypingTitle text="What's in your fridge?" />
        </Grid>
        <Grid item xs={12}>
          <form noValidate autoComplete="off" onSubmit={handleAddIngredient}>
            <Box sx={{ m: 1 }}>
              <TextField
                variant="outlined"
                inputRef={inputRef}
                id="ingredient"
                onChange={(e) => setNewIngredient(e.target.value)}
                value={newIngredient}
                className={classes.textField}
              />
              <IconButton
                disabled={newIngredient.trim().length === 0}
                variant="contained"
                color="primary"
                type="submit"
                id="add-ingredient"
              >
                <AddIcon />
              </IconButton>
            </Box>
          </form>
          <Box>
            <FilterChips
              onDelete={handleDeleteIngredient}
              ingredients={ingredients}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoToNextPage}
            disabled={ingredients.length === 0}
            disableElevation
            size="large"
          >
            Next
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
    </>
  );
}
