import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress } from '@material-ui/core';
import { useEffect, useState, useRef } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Results from './Results.js';
import Search from './Search.js';
import Filter from './Filter.js';
import Progress from './Progress.js';
import { useSelector, useDispatch } from 'react-redux';
import { addSearchTerm, clearFilters } from './ingredientsSlice.js';

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
  // const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const inputRef = useRef();
  const history = useHistory();
  const location = useLocation();

  const searchTerm = useSelector((state) => state.ingredients.searchTerm);

  const dispatch = useDispatch();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        inputRef.current.focus();
        setActiveStep(0);
        break;
      case '/filters':
        searchTerm === '' && history.push('/');
        inputRef.current.focus();
        setActiveStep(1);
        break;
      case '/results':
        searchTerm === '' && history.push('/');
        setActiveStep(3);
        break;
      default:
        history.push('/');
    }
  }, [location, history, searchTerm]);

  function handleRestartClick() {
    dispatch(addSearchTerm(''));
    dispatch(clearFilters());
    history.push('/');
  }

  return (
    <>
      <div className={classes.root}>
        <Box>
          <Progress activeStep={activeStep} />
          <Switch>
            <Route exact path="/">
              {isLoading ? (
                <CircularProgress />
              ) : (
                <Search
                  history={history}
                  inputRef={inputRef}
                  setIsLoading={setIsLoading}
                  classes={classes}
                />
              )}
            </Route>
            <Route exact path="/filters">
              <Filter
                history={history}
                inputRef={inputRef}
                handleRestartClick={handleRestartClick}
              />
            </Route>
            <Route exact path="/results">
              <Results
                classes={classes}
                handleRestartClick={handleRestartClick}
              />
            </Route>
          </Switch>
        </Box>
      </div>
    </>
  );
}
