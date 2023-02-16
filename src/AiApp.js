import { Route, Switch } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Generate from './components/ai/Generate';
import Recipe from './components/ai/Recipe';
import ChooseIngredients from './components/ai/Ingredients';
import { clearIngredients, addCuisineType } from './redux/ai/inputSlice.js';

export default function AiApp(props) {
  const { classes, isLoading, setIsLoading, inputRef, history } = props;
  const dispatch = useDispatch();

  function handleRestartClick() {
    dispatch(addCuisineType(''));
    dispatch(clearIngredients());
    history.push('/');
  }

  return (
    <>
      <Switch>
        <Route exact path="/">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <ChooseIngredients
              history={history}
              inputRef={inputRef}
              setIsLoading={setIsLoading}
              handleRestartClick={handleRestartClick}
            />
          )}
        </Route>
        <Route exact path="/cuisine">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Generate
              classes={classes}
              handleRestartClick={handleRestartClick}
              setIsLoading={setIsLoading}
              history={history}
              inputRef={inputRef}
            />
          )}
        </Route>
        <Route exact path="/recipe">
          <Recipe classes={classes} handleRestartClick={handleRestartClick} />
        </Route>
      </Switch>
    </>
  );
}