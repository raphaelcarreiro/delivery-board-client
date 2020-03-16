import React, { useState, useEffect } from 'react';
import CustomAppbar from '../appbar/CustomAppbar';
import IndexAppbarActions from './IndexAppbarActions';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import Link from '../link/Link';

import { moneyFormat } from 'src/helpers/numberFormat';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flex: 0.8,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    '& div': {
      textAlign: 'center',
    },
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
  restaurant: {
    marginTop: 20,
  },
  user: {
    margin: '20px 0',
    '& a': {
      display: 'inline-block',
      marginTop: 10,
      fontSize: 20,
    },
  },
  closed: {
    padding: 10,
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 4,
    marginBottom: 15,
  },
  logo: {
    maxWidth: 150,
    borderRadius: 4,
  },
  logoContainer: {
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
}));

export default function Index() {
  const restaurant = useSelector(state => state.restaurant);
  const classes = useStyles();

  return (
    <>
      <CustomAppbar title="Início" actionComponent={<IndexAppbarActions />} />
      {restaurant && (
        <div className={classes.container}>
          {restaurant.image && (
            <div className={classes.logoContainer}>
              <img src={restaurant.image.imageUrl} alt={restaurant.name} className={classes.logo} />
            </div>
          )}
          <div className={classes.restaurant}>
            <Typography variant="h6">{restaurant.name}</Typography>
            <Typography variant="body1">{restaurant.description}</Typography>
          </div>
          <div className={classes.user}>
            <Button variant="contained" color="primary" component={Link} href="/menu">
              Acessar cardápio
            </Button>
          </div>
          <div>
            {restaurant.configs.order_minimum_value && restaurant.configs.tax_mode !== 'order_value' && (
              <Typography color="textSecondary" gutterBottom variant="body2">
                *{restaurant.configs.formattedOrderMinimumValue} é o valor mínimo para o pedido
              </Typography>
            )}
            <Typography variant="body1" gutterBottom>
              {restaurant.working_hours}
            </Typography>
            {restaurant.configs.tax_mode === 'order_value' && (
              <Typography variant="caption" color="textSecondary">
                {`*A taxa de entrega ${restaurant.configs.formattedTax} será cobrada, se o valor do pedido mínimo não for atingido`}
              </Typography>
            )}
          </div>
        </div>
      )}
    </>
  );
}
