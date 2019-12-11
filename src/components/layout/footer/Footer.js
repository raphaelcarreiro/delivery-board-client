import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

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
  const restaurant = useSelector(state => state.restaurant);

  return (
    <footer className={classes.footer}>
      {restaurant ? <Typography>{restaurant.name}</Typography> : <span>Carregando...</span>}
    </footer>
  );
}

export default Footer;
