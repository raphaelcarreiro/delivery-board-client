import { makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { Restaurant } from 'src/types/restaurant';

interface MakeStylesProps {
  coverUrl: string;
  mobileCoverUrl: string;
}

const useStyles = makeStyles<Theme, MakeStylesProps>(theme => ({
  cover: {
    height: 300,
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      height: 300,
    },
  },
  background: ({ coverUrl, mobileCoverUrl }) => ({
    top: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundImage: `url(${coverUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    zIndex: 2,
    borderRadius: '10px 10px 0 0',
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
      backgroundImage: mobileCoverUrl ? `url(${mobileCoverUrl})` : `url(${coverUrl})`,
    },
  }),
}));

type CoverProps = {
  restaurant: Restaurant;
};

const Cover: React.FC<CoverProps> = ({ restaurant }) => {
  const classes = useStyles({
    coverUrl: restaurant ? restaurant.cover.imageUrl : '',
    mobileCoverUrl: restaurant && restaurant.mobile_cover ? restaurant.mobile_cover.imageUrl : '',
  });

  return (
    <div className={classes.cover}>
      <div className={classes.background} />
    </div>
  );
};

export default Cover;
