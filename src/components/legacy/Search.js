import { Button, TextField, Grid } from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import TypingTitle from '../common/TypingTitle.js';
import { useSelector, useDispatch } from 'react-redux';
import { search } from '../../redux/legacy/resultsSlice.js';
import { addSearchTerm } from '../../redux/legacy/ingredientsSlice.js';

export default function Search(props) {
  const { history, inputRef, setIsLoading, handleRestartClick } = props;

  const { REACT_APP_APP_ID, REACT_APP_APP_KEY } = process.env;

  const dispatch = useDispatch();

  const { searchTerm } = useSelector((state) => state.ingredients);

  function handleSearch(event) {
    event.preventDefault();
    setIsLoading(true);
    fetch(
      `https://api.edamam.com/search?q=${searchTerm.toLowerCase()}&app_id=${REACT_APP_APP_ID}&app_key=${REACT_APP_APP_KEY}&to=100`,
    )
      .then((response) => response.json())
      .then((data) => {
        dispatch(search(data.hits));
        setIsLoading(false);
        history.push('/filters');
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
      });
  }

  function handleSetSearchTerm(event) {
    dispatch(addSearchTerm(event.target.value.trim()));
  }

  return (
    <>
      <form noValidate autoComplete="off" onSubmit={handleSearch}>
        <Grid
          container
          style={{
            height: '80vh',
            justifyContent: 'center',
          }}
        >
          <Grid item xs={12}>
            <TypingTitle text="What's in your fridge?" />
          </Grid>

          <Grid item xs={12}>
            <TextField
              inputRef={inputRef}
              id="search"
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleSetSearchTerm}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              size="large"
              disabled={searchTerm.length === 0}
              variant="contained"
              color="primary"
              type="submit"
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
      </form>
    </>
  );
}
