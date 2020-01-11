import React from 'react';
import CustomAppbar from '../appbar/CustomAppbar';
import IndexAppbarActions from './IndexAppbarActions';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
  },
  closedRestaurant: {
    backgroundColor: theme.palette.error.main,
    padding: 15,
    color: theme.palette.error.contrastText,
    borderRadius: 4,
    width: '100%',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: 10,
    },
  },
}));

export default function Index() {
  const restaurant = useSelector(state => state.restaurant) || {};
  const classes = useStyles();

  console.log(process.env.BASEURL_API);

  return (
    <>
      <CustomAppbar title={restaurant.name ? restaurant.name : 'Carregando'} actionComponent={<IndexAppbarActions />} />
      <div className={classes.container}>
        {!restaurant.is_open && (
          <div className={classes.closedRestaurant}>
            <Typography className={classes.message}>
              <ErrorIcon /> {restaurant.name} está fechado no momento. Não será possível fazer pedido.
            </Typography>
          </div>
        )}
      </div>
    </>
  );
}
