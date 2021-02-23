import { Button, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

export default function Search(props) {

  const { history, inputRef, setResults, searchTerm, setSearchTerm, setIsLoading, classes } = props
  const { REACT_APP_APP_ID, REACT_APP_APP_KEY } = process.env;

  function handleSearch(event) {
    event.preventDefault();
    setIsLoading(true)
    fetch(`https://api.edamam.com/search?q=${searchTerm}&app_id=${REACT_APP_APP_ID}&app_key=${REACT_APP_APP_KEY}&to=100`)
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

  return (
    <>
      <div>
        <h1>What's in your fridge?</h1>
      </div> 
      <div>
        <form noValidate className={classes.root} autoComplete="off" onSubmit={handleSearch}>
          <TextField inputRef={inputRef} id="outlined-basic" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <br />
          <Button disabled={searchTerm.length === 0} variant="contained" color="primary" type="submit" endIcon={<SendIcon />}>Next</Button>
        </form>
      </div>
    </>
  )
}