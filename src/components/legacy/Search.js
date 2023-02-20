import { Button, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import TypingTitle from '../common/TypingTitle.js';
import { useSelector, useDispatch } from 'react-redux';
import { search } from '../../redux/legacy/resultsSlice.js';
import { addSearchTerm } from '../../redux/legacy/ingredientsSlice.js';

export default function Search(props) {
  const { history, inputRef, setIsLoading, classes } = props;

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
      <div>
        <TypingTitle text="What's in your fridge?" />
      </div>
      <div>
        <form
          noValidate
          className={classes.root}
          autoComplete="off"
          onSubmit={handleSearch}
        >
          <TextField
            inputRef={inputRef}
            id="search"
            inputProps={{ 'aria-label': 'search' }}
            onChange={handleSetSearchTerm}
          />
          <br />
          <Button
            size="large"
            disabled={searchTerm.length === 0}
            variant="contained"
            color="primary"
            type="submit"
            endIcon={<SendIcon />}
          >
            Next
          </Button>
        </form>
      </div>
    </>
  );
}
