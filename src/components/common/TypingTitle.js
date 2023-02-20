import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  cursor: {
    display: 'inline-block',
    width: '0.2em',
    height: '1em',
    animation: '$blink 1s infinite',
  },
  '@keyframes blink': {
    '50%': {
      opacity: 0,
    },
  },
});

export default function TypingTitle(props) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [blink, setBlink] = useState(false);
  const classes = useStyles();
  const delay = 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setText(props.text.substring(0, index));
      setIndex((index) => index + 1);
    }, delay);

    return () => clearInterval(interval);
  }, [delay, index, props.text]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((blink) => !blink);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Typography variant="h4" style={{ fontWeight: 'bold' }}>
      {text}
      <span className={classes.cursor} style={{ opacity: blink ? 1 : 0 }}>
        |
      </span>
    </Typography>
  );
}
