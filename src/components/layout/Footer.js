import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from '../../../pages/_app';

const useStyles = makeStyles(theme => ({
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTop: '1px solid #eee',
    height: 70,
    backgroundColor: '#fff',
  },
}));

function Footer() {
  const classes = useStyles();
  const appContext = useContext(AppContext);

  return (
    <footer className={classes.footer}>
      {appContext.restaurant ? <Typography>{appContext.restaurant.name}</Typography> : <span>teste</span>}
    </footer>
  );
}

export default Footer;
