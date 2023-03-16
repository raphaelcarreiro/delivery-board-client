import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  finalPrice: {
    textAlign: 'right',
    minWidth: 80,
    fontWeight: 500,
  },
});

type BoardProductDetailTotalProps = {
  total: string;
};

const BoardProductDetailTotal: React.FC<BoardProductDetailTotalProps> = ({ total }) => {
  const classes = useStyles();

  return (
    <Typography variant="h5" className={classes.finalPrice} color="textPrimary">
      {total}
    </Typography>
  );
};

export default BoardProductDetailTotal;
