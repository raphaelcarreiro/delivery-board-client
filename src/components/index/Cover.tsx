import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Restaurant } from 'src/types/restaurant';

const useStyles = makeStyles(theme => ({
  cover: {
    height: 300,
    position: 'relative',
    zIndex: 1,
  },
  background: ({ coverUrl }: { coverUrl: string }) => ({
    top: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundImage: `url(${coverUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    filter: 'brightness(0.7) blur(0px)',
    zIndex: 2,
    borderRadius: '10px 10px 0 0',
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
    },
  }),
}));

type CoverProps = {
  restaurant: Restaurant;
};

const Cover: React.FC<CoverProps> = ({ restaurant }) => {
  const classes = useStyles({ coverUrl: restaurant && restaurant.cover ? restaurant.cover.imageUrl : '' });

  return (
    <div className={classes.cover}>
      <div className={classes.background} />
    </div>
  );
};

export default Cover;
