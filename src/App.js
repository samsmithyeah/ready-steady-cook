import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress } from '@material-ui/core';
import { useEffect, useState, useRef} from 'react'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Results from './Results.js'
import Search from './Search.js'
import Filter from './Filter.js'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center'
    },
  },
}));

export default function App() {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/filters") {
      inputRef.current.focus();
    }
  }, [location]);


  

  function handleRestartClick() {
    setSearchTerm("")
    setFilters([])
    setFilteredResults([])
    history.push("/")
  }


  return (
    <>
      <div className={classes.root}>
        <Box>
          <Switch>
            <Route exact path="/">
              {isLoading ? <CircularProgress /> : <Search history={history} inputRef={inputRef} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setResults={setResults} setIsLoading={setIsLoading} classes={classes} />}
            </Route>
            <Route exact path="/filters"> 
              <Filter filters={filters} history={history} results={results} searchTerm={searchTerm} inputRef={inputRef} handleRestartClick={handleRestartClick} setFilters={setFilters} setFilteredResults={setFilteredResults}/>
            </Route>
            <Route exact path="/results">
              <Results results={results} filters={filters} searchTerm={searchTerm} filteredResults={filteredResults} handleRestartClick={handleRestartClick}/>
            </Route>
          </Switch>
        </Box>
      </div>  
    </>
  )
};