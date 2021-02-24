import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress } from '@material-ui/core';
import { useEffect, useState, useRef} from 'react'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Results from './Results.js'
import Search from './Search.js'
import Filter from './Filter.js'
import Progress from './Progress.js'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      textAlign: 'center',
      alignItems: 'center',
    },
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default function App() {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0)
  const inputRef = useRef();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        inputRef.current.focus();
        setActiveStep(0)
        break;
      case "/filters":
        inputRef.current.focus();
        setActiveStep(1)
        break;
      case "/results":
        setActiveStep(3)
        break;
      default:
        history.push("/")
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
          <Progress activeStep={activeStep}/>
          <Switch>
            <Route exact path="/">
              {isLoading ? <CircularProgress /> : <Search history={history} inputRef={inputRef} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setResults={setResults} setIsLoading={setIsLoading} classes={classes} />}
            </Route>
            <Route exact path="/filters"> 
              <Filter filters={filters} history={history} results={results} searchTerm={searchTerm} inputRef={inputRef} handleRestartClick={handleRestartClick} setFilters={setFilters} setFilteredResults={setFilteredResults}/>
            </Route>
            <Route exact path="/results">
              <Results classes={classes} results={results} filters={filters} searchTerm={searchTerm} filteredResults={filteredResults} handleRestartClick={handleRestartClick}/>
            </Route>
          </Switch>
        </Box>
      </div>  
    </>
  )
};