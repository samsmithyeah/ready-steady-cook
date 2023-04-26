import React from 'react';
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { CssBaseline, Paper } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { useEffect, useState, useRef } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import AiApp from './AiApp.js';
import LegacyApp from './LegacyApp.js';
import ToolBar from './components/common/Toolbar/ToolBar.js';
import { useSelector } from 'react-redux';
import { inject } from '@vercel/analytics';

if (!process.env.REACT_APP_TEST) {
  inject();
}

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
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '1.3rem', // Change the borderRadius value to adjust the roundness of the outline
    },
  },
  twitterButton: {
    backgroundColor: '#1DA1F2',
    color: 'white',
    '&:hover': {
      backgroundColor: '#1A91DA',
    },
    margin: theme.spacing(1),
  },
  widgetContainer: {
    '& .rcw-input': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    '& .rcw-message': {
      fontFamily: theme.typography.fontFamily,
    },
    '& .rcw-conversation-container': {
      width: '400px',
    },
    '& .rcw-header': {
      backgroundColor: grey[600],
      fontFamily: theme.typography.fontFamily,
    },
    '& .rcw-message-text': {
      backgroundColor: '#303030',
      color: 'white',
    },
    '& .rcw-messages-container': {
      backgroundColor: grey[100],
    },
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
    overrides: {
      MuiButton: {
        root: {
          textTransform: 'none',
        },
        sizeLarge: {
          fontWeight: 'bold',
          fontSize: '1.2rem',
          borderRadius: '0.6rem',
        },
      },
      MuiStepIcon: {
        root: {
          '&$completed': {
            color: '#75bf6b',
          },
        },
        active: {},
        completed: {},
      },
    },
  });

  const recipeMatch = useRouteMatch('/recipe/:uuid');

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        inputRef.current && inputRef.current.focus();
        setActiveStep(0);
        break;
      case '/cuisine':
        if (!aiIngredients || aiIngredients.length === 0) {
          history.push('/');
        }
        mode === 'legacy' && history.push('/');
        setActiveStep(1);
        break;
      case '/recipe':
        if (!aiIngredients || aiIngredients.length === 0) {
          history.push('/');
        }
        !recipe && history.push('/');
        mode === 'legacy' && history.push('/');
        !activeStep === 3 && setActiveStep(2);
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
        if (recipeMatch) {
          if (!aiIngredients) {
            console.log('Redirecting to homepage: aiIngredients not set');
            history.push('/');
          }
          if (mode === 'legacy') {
            console.log('Redirecting to homepage: mode is legacy');
            history.push('/');
          }
        } else {
          history.push('/');
        }
    }
  }, [
    location,
    history,
    aiIngredients,
    legacyIngredients,
    searchTerm,
    mode,
    recipe,
    recipeMatch,
    activeStep,
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
                setActiveStep={setActiveStep}
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
