import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  img: {
    width: 25,
  },
});

export default function GoogleIcon() {
  const classes = useStyles();
  return <img src="/images/google_icon.png" alt="Google Logo" className={classes.img} />;
}
