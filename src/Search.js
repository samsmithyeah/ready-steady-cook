import { Button, TextField, Typography } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

export default function Search(props) {

  const { history, inputRef, setResults, searchTerm, setSearchTerm, setIsLoading, classes } = props
  const { REACT_APP_APP_ID, REACT_APP_APP_KEY } = process.env;

  function handleSearch(event) {
    event.preventDefault();
    setIsLoading(true)
    fetch(`https://api.edamam.com/search?q=${searchTerm.toLowerCase()}&app_id=${REACT_APP_APP_ID}&app_key=${REACT_APP_APP_KEY}&to=100`)
      .then(response => response.json())
      .then(data => {
        setResults(data.hits);
        setIsLoading(false)
        history.push('/filters')
      })
      .catch(err => {
        setIsLoading(false)
        console.error(err);
      }); 
  }

  function handleSetSearchTerm(event) {
    setSearchTerm(event.target.value)
  }

  return (
    <>
      <div>
        <Typography variant="h4" gutterBottom>What's in your fridge?</Typography>
      </div> 
      <div>
        <form noValidate className={classes.root} autoComplete="off" onSubmit={handleSearch}>
          <TextField inputRef={inputRef} id="outlined-basic" value={searchTerm} onChange={handleSetSearchTerm} />
          <br />
          <Button size='large' disabled={searchTerm.length === 0} variant="contained" color="primary" type="submit" endIcon={<SendIcon />}>Next</Button>
        </form>
      </div>
    </>
  )
}