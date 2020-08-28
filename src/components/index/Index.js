import React from 'react';
import CustomAppbar from '../appbar/CustomAppbar';
import IndexAppbarActions from './IndexAppbarActions';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import Link from '../link/Link';
import StatusIcon from '@material-ui/icons/FiberManualRecord';
import ScheduleIcon from '@material-ui/icons/Schedule';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
  },
  action: {
    margin: '40px 0',
  },
  logo: {
    maxWidth: 80,
    borderRadius: 4,
    zIndex: 2,
    padding: 2,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 20,
    right: 20,
    [theme.breakpoints.down('sm')]: {
      maxWidth: 60,
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
  info: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    '&>h5': {
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        fontSize: 20,
      },
    },
  },
  headerRestaurantName: {
    position: 'absolute',
    color: '#fff',
    zIndex: 2,
    top: '40%',
    left: '10%',
    [theme.breakpoints.down('sm')]: {
      top: 0,
      left: 0,
      padding: 20,
    },
  },
  main: {
    padding: '5px 15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  working: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 0',
  },
  restaurantStatus: ({ restaurantIsOpen }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0 5px',
    borderRadius: 4,
    '& svg': {
      color: restaurantIsOpen ? '#28a745' : '#dc3545',
      marginRight: 5,
    },
    '& p': {
      fontWeight: 600,
    },
  }),
  deliveryTime: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& svg': {
      marginRight: 7,
    },
  },
}));

export default function Index() {
  const restaurant = useSelector(state => state.restaurant);
  const classes = useStyles({
    coverUrl: restaurant && restaurant.cover && restaurant.cover.imageUrl,
    restaurantIsOpen: restaurant ? restaurant.is_open : false,
  });

  return (
    <>
      <CustomAppbar title="início" actionComponent={<IndexAppbarActions />} />
      {restaurant && (
        <div className={classes.container}>
          <div className={classes.cover}>
            <div className={classes.background} />
            <div className={classes.headerRestaurantName}>
              <Typography variant="h4" color="inherit">
                {restaurant.name}
              </Typography>
              <Typography color="inherit">{restaurant.description}</Typography>
            </div>
            {restaurant.image && <img src={restaurant.image.imageUrl} alt={restaurant.name} className={classes.logo} />}
          </div>
          <div className={classes.main}>
            <div className={classes.info}>
              {restaurant.configs.delivery_time > 0 && (
                <div className={classes.deliveryTime}>
                  <ScheduleIcon />
                  <Typography variant="h6" className={classes.infoItem}>
                    {restaurant.configs.delivery_time} minutos
                  </Typography>
                </div>
              )}
              {restaurant.configs.order_minimum_value > 0 && restaurant.configs.tax_mode !== 'order_value' && (
                <Typography color="textSecondary" variant="h6" className={classes.infoItem}>
                  {restaurant.configs.formattedOrderMinimumValue} mínimo
                </Typography>
              )}
            </div>
            <div className={classes.action}>
              <Button variant="contained" size="large" color="primary" component={Link} href="/menu">
                Acessar cardápio
              </Button>
            </div>
            <div className={classes.working}>
              <div className={classes.restaurantStatus}>
                <StatusIcon />
                <Typography>{restaurant.is_open ? 'Aberto' : 'Fechado'}</Typography>
              </div>
              <Typography color="textSecondary" align="center" variant="body1">
                {restaurant.working_hours}
              </Typography>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
