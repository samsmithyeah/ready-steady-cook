import React from 'react';
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { CssBaseline, Paper } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { useEffect, useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import AiApp from './AiApp.js';
import LegacyApp from './LegacyApp.js';
import ToolBar from './components/common/Toolbar/ToolBar.js';
import { useSelector } from 'react-redux';

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
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [themeType, setThemeType] = useState('dark');
  const [mode, setMode] = useState('ai');
  const inputRef = useRef();
  const history = useHistory();
  const location = useLocation();
  const searchTerm = useSelector((state) => state.ingredients.searchTerm);
  const aiIngredients = useSelector((state) => state.input.ingredients);
  const legacyIngredients = useSelector(
    (state) => state.ingredients.ingredients,
  );
  const { recipe } = useSelector((state) => state.recipe);

  const theme = createTheme({
    palette: {
      type: themeType,
      background: {
        paper: themeType === 'dark' ? '#303030' : grey[50],
      },
    },
    typography: {
      fontFamily: 'Manrope, sans-serif',
    },
  });

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        inputRef.current.focus();
        setActiveStep(0);
        break;
      case '/cuisine':
        !aiIngredients && history.push('/');
        mode === 'legacy' && history.push('/');
        setActiveStep(1);
        break;
      case '/recipe':
        !aiIngredients && history.push('/');
        !recipe && history.push('/');
        mode === 'legacy' && history.push('/');
        setActiveStep(3);
        break;
      case '/filters':
        !searchTerm && history.push('/');
        mode === 'ai' && history.push('/');
        mode === 'legacy' && inputRef.current.focus();
        setActiveStep(1);
        break;
      case '/results':
        !searchTerm && history.push('/');
        mode === 'ai' && history.push('/');
        setActiveStep(3);
        break;
      default:
        history.push('/');
    }
  }, [
    location,
    history,
    aiIngredients,
    legacyIngredients,
    searchTerm,
    mode,
    recipe,
  ]);

  function handleThemeChange(event) {
    setThemeType(event.target.checked ? 'dark' : 'light');
  }

  function handleModeChange(event) {
    setMode(event.target.checked ? 'ai' : 'legacy');
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={classes.root}>
          <Paper elevation={0}>
            <ToolBar
              handleModeChange={handleModeChange}
              mode={mode}
              handleThemeChange={handleThemeChange}
              themeType={themeType}
            />
            {mode === 'ai' ? (
              <AiApp
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                history={history}
                inputRef={inputRef}
                classes={classes}
                activeStep={activeStep}
              />
            ) : (
              <LegacyApp
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                history={history}
                inputRef={inputRef}
                classes={classes}
                activeStep={activeStep}
              />
            )}
          </Paper>
        </div>
      </ThemeProvider>
    </>
  );
}
