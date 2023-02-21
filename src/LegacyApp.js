import { Route, Switch } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import Search from './components/legacy/Search';
import Filter from './components/legacy/Filter';
import Results from './components/legacy/Results';
import Progress from './components/common/Progress';
import {
  addSearchTerm,
  clearFilters,
} from './redux/legacy/ingredientsSlice.js';
import { useDispatch } from 'react-redux';

export default function LegacyApp(props) {
  const {
    classes,
    isLoading,
    setIsLoading,
    inputRef,
    history,
    activeStep,
  } = props;
  const steps = ['Primary ingredient', 'Other ingredients', 'Results'];
  const dispatch = useDispatch();

  function handleRestartClick() {
    dispatch(addSearchTerm(''));
    dispatch(clearFilters());
    history.push('/');
  }

  return (
    <>
      <Progress activeStep={activeStep} steps={steps} />
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
              handleRestartClick={handleRestartClick}
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
          <Results classes={classes} handleRestartClick={handleRestartClick} />
        </Route>
      </Switch>
    </>
  );
}
