import React from 'react';
import CustomAppbar from '../appbar/CustomAppbar';
import IndexAppbarActions from './IndexAppbarActions';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import Link from '../link/Link';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
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
    [theme.breakpoints.down('sm')]: {
      marginTop: 10,
    },
  },
  menu: {
    margin: '20px 0',
  },
  closed: {
    padding: 10,
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 4,
    marginBottom: 15,
  },
  logo: {
    maxWidth: 100,
    borderRadius: 4,
    zIndex: 2,
    padding: 2,
    backgroundColor: '#fff',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 100,
    },
  },
  cover: {
    width: '100%',
    height: 300,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 10,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
    backgroundColor: '#555',
  },
  background: ({ coverUrl }) => ({
    backgroundImage: `url(${coverUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    filter: 'brightness(0.5) blur(2px)',
    position: 'absolute',
    top: -1,
    bottom: -1,
    left: -1,
    right: -1,
    zIndex: 2,
  }),
  textInfo: {
    color: '#fff',
    zIndex: 2,
  },
  info: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 6,
    '&>h5': {
      marginLeft: 15,
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        fontSize: 20,
      },
    },
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-between',
      marginLeft: 0,
      fontSize: 20,
    },
  },
}));

export default function Index() {
  const restaurant = useSelector(state => state.restaurant);
  const classes = useStyles({ coverUrl: restaurant && restaurant.cover && restaurant.cover.imageUrl });

  return (
    <>
      <CustomAppbar title="início" actionComponent={<IndexAppbarActions />} />
      {restaurant && (
        <div className={classes.container}>
          <div className={classes.cover}>
            <div className={classes.background} />
            <Typography variant="body1" className={classes.textInfo}>
              {restaurant.working_hours}
            </Typography>
            {restaurant.image && <img src={restaurant.image.imageUrl} alt={restaurant.name} className={classes.logo} />}
          </div>
          <div className={classes.info}>
            {restaurant.configs.delivery_time > 0 && (
              <Typography color="textSecondary" variant="h5" className={classes.infoItem}>
                {restaurant.configs.delivery_time} minutos
              </Typography>
            )}
            {restaurant.configs.order_minimum_value > 0 && restaurant.configs.tax_mode !== 'order_value' && (
              <Typography color="textSecondary" variant="h5" className={classes.infoItem}>
                {restaurant.configs.formattedOrderMinimumValue} mínimo
              </Typography>
            )}
          </div>
          <div className={classes.restaurant}>
            <Typography variant="h4">{restaurant.name}</Typography>
            <Typography variant="body1">{restaurant.description}</Typography>
          </div>
          <div className={classes.menu}>
            <Button variant="contained" size="large" color="primary" component={Link} href="/menu">
              Acessar cardápio
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
