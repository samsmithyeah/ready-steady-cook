import {
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
} from '@material-ui/core';
import FilterChips from '../common/FilterChips.js';
import SendIcon from '@material-ui/icons/Send';
import AddIcon from '@material-ui/icons/Add';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useSelector, useDispatch } from 'react-redux';
import { addIngredient, deleteIngredient } from '../../redux/ai/inputSlice.js';
import { useState } from 'react';

export default function ChooseIngredients(props) {
  const { history, inputRef, setIsLoading, handleRestartClick } = props;
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
      <Typography variant="h4" gutterBottom>
        What's in your fridge?
      </Typography>
      <Box height={220}>
        <form noValidate autoComplete="off" onSubmit={handleAddIngredient}>
          <TextField
            inputRef={inputRef}
            id="ingredient"
            onChange={(e) => setNewIngredient(e.target.value)}
            value={newIngredient}
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
        </form>
        <FilterChips
          onDelete={handleDeleteIngredient}
          ingredients={ingredients}
        />
      </Box>
      <Box height={210}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoToNextPage}
          endIcon={<SendIcon />}
          disabled={ingredients.length === 0}
          disableElevation
        >
          Next
        </Button>
      </Box>
      <Button onClick={handleRestartClick} endIcon={<AutorenewIcon />}>
        Start again
      </Button>
    </>
  );
}
