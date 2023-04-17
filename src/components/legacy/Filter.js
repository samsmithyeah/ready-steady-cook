import { Button, IconButton, TextField, Grid, Box } from '@material-ui/core';
import FilterChips from '../common/FilterChips.js';
import TypingTitle from '../common/TypingTitle.js';
import AddIcon from '@material-ui/icons/Add';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addFilter,
  deleteFilter,
} from '../../redux/legacy/ingredientsSlice.js';
import { filter } from '../../redux/legacy/resultsSlice.js';

export default function Filter(props) {
  const [newFilter, setNewFilter] = useState('');

  const { filters, searchTerm } = useSelector((state) => state.ingredients);
  const { filteredResults, unfilteredResults } = useSelector(
    (state) => state.results,
  );
  const dispatch = useDispatch();

  const { history, inputRef, handleRestartClick, classes } = props;

  useEffect(() => {
    if (filters.length === 0) {
      dispatch(filter(unfilteredResults));
    } else {
      dispatch(
        filter(
          unfilteredResults.filter((result) => {
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
  }, [dispatch, filters, unfilteredResults]);

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
      <Grid container style={{ height: '80vh' }}>
        <Grid item xs={12}>
          <TypingTitle
            text={`What would you like with your ${searchTerm.toLowerCase()}?`}
          />
        </Grid>
        <Grid item xs={12}>
          <form noValidate autoComplete="off" onSubmit={handleAddFilter}>
            <Box sx={{ m: 1 }}>
              <TextField
                variant="outlined"
                inputRef={inputRef}
                id="filter"
                value={newFilter}
                onChange={(e) => setNewFilter(e.target.value)}
                className={classes.textField}
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
            </Box>
          </form>
          <FilterChips onDelete={handleDeleteFilter} ingredients={filters} />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFilterResults}
            disabled={filteredResults.length === 0}
            disableElevation
            size="large"
          >
            {viewResultsButtonText()}
          </Button>
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
      </Grid>
    </>
  );
}
