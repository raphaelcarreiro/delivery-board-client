import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Restaurant } from 'src/types/restaurant';

const useStyles = makeStyles(theme => ({
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
    flexShrink: 0,
  },
  background: ({ coverUrl }: { coverUrl: string }) => ({
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
}));

type CoverProps = {
  restaurant: Restaurant;
};

const Cover: React.FC<CoverProps> = ({ restaurant }) => {
  const classes = useStyles({ coverUrl: restaurant && restaurant.cover ? restaurant.cover.imageUrl : '' });

  return (
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
  );
};

export default Cover;
