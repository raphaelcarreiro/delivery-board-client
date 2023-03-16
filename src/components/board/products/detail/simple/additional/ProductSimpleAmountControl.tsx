import React, { useState } from 'react';
import { makeStyles, Typography, IconButton } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';

const useStyles = makeStyles({
  amountControl: {
    display: 'flex',
    alignItems: 'center',
    width: 70,
    justifyContent: 'flex-end',
  },
  amount: {
    display: 'inline-flex',
    margin: '0 10px',
  },
});

type ProductSimpleAmountControlProps = {
  selectedAmount?: number;
};

const ProductSimpleAmountControl: React.FC<ProductSimpleAmountControlProps> = ({ selectedAmount }) => {
  const classes = useStyles();
  const [amount] = useState(selectedAmount || 0);

  return (
    <div className={classes.amountControl}>
      {amount > 0 && (
        <IconButton size="small" disabled={amount === 0}>
          <Remove color="primary" />
        </IconButton>
      )}
      {amount !== 0 && (
        <Typography variant="h6" className={classes.amount}>
          {amount}
        </Typography>
      )}
      <IconButton size="small">
        <Add color="primary" />
      </IconButton>
    </div>
  );
};

export default ProductSimpleAmountControl;
