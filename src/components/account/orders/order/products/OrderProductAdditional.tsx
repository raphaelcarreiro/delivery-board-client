import React from 'react';
import { OrderProductAdditional as OrderProductAdditionalType } from 'src/types/product';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    '& > p': {
      marginRight: 10,
      color: theme.palette.success.main,
    },
  },
}));

type OrderProductAdditionalProps = {
  additional: OrderProductAdditionalType[];
};

const OrderProductAdditional: React.FC<OrderProductAdditionalProps> = ({ additional }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {additional
        .filter(a => a.selected)
        .map(a => (
          <Typography key={a.id} display="inline" variant="body2">
            c/ {a.amount}x {a.name}
          </Typography>
        ))}
    </div>
  );
};

export default OrderProductAdditional;
