import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import FilterChips from './FilterChips.js';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addFilter, deleteFilter } from './ingredientsSlice.js';
import { filter } from './resultsSlice.js';

export default function Filter(props) {
  const [newFilter, setNewFilter] = useState('');

  const filters = useSelector((state) => state.ingredients.filters);
  const results = useSelector((state) => state.results.unfiltered);
  const filteredResults = useSelector((state) => state.results.filtered);
  const searchTerm = useSelector((state) => state.ingredients.searchTerm);

  const dispatch = useDispatch();

  const { history, inputRef, handleRestartClick } = props;

  useEffect(() => {
    if (filters.length === 0) {
      dispatch(filter(results));
    } else {
      dispatch(
        filter(
          results.filter((result) => {
            return filters.every((filter) => {
              return result.recipe.ingredientLines
                .toString()
                .toLowerCase()
                .includes(filter);
            });
          }),
        ),
      );
    }
  }, [dispatch, filters, results]);

  function handleAddFilter(event) {
    event.preventDefault();

    dispatch(addFilter(newFilter));

    setNewFilter('');
  }

  function handleDeleteFilter(filterToDelete) {
    dispatch(deleteFilter(filterToDelete));
  }

  function handleFilterResults() {
    history.push('/results');
  }

  function viewResultsButtonText() {
    if (filteredResults.length === 0) {
      return 'No results';
    } else if (filteredResults.length === 1) {
      return 'View 1 result';
    } else {
      return `View ${filteredResults.length} results`;
    }
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        What would you like with your {searchTerm.toLowerCase()}?
      </Typography>
      <Box height={100}>
        <form noValidate autoComplete="off" onSubmit={handleAddFilter}>
          <TextField
            inputRef={inputRef}
            id="filter"
            value={newFilter}
            onChange={(e) => setNewFilter(e.target.value)}
          />
          <IconButton
            disabled={newFilter.length === 0}
            variant="contained"
            color="primary"
            type="submit"
            id="add-filter"
          >
            <AddIcon />
          </IconButton>
        </form>
        <FilterChips onDelete={handleDeleteFilter} />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleFilterResults}
        endIcon={<SendIcon />}
        disabled={filteredResults.length === 0}
        disableElevation
      >
        {viewResultsButtonText()}
      </Button>
      <br />
      <Button onClick={handleRestartClick} endIcon={<AutorenewIcon />}>
        Start again
      </Button>
    </>
  );
}
