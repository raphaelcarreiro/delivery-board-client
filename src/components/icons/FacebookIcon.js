import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    backgroundColor: '#fff',
    width: 25,
    height: 25,
    display: 'flex',
  },
  img: {
    width: 25,
  },
});

export default function FacebookIcon() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <img src="/images/facebook_icon.png" alt="Google Logo" className={classes.img} />
    </div>
  );
}
