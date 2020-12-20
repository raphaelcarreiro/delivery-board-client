import React, { MouseEvent, useEffect, useState } from 'react';
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

type ProductViewAmountControlProps = {
  handleClickAdditional(additionalId: number, amount: number): void;
  additionalId: number;
};

const ProductViewAmountControl: React.FC<ProductViewAmountControlProps> = ({ handleClickAdditional, additionalId }) => {
  const classes = useStyles();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    handleClickAdditional(additionalId, amount);
  }, [amount]); // eslint-disable-line

  function handleAmountUp(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setAmount(amount => amount + 1);
  }

  function handleAmountDown(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setAmount(amount => amount - 1);
  }

  return (
    <div className={classes.amountControl}>
      {amount > 0 && (
        <IconButton size="small" disabled={amount === 0} onClick={e => handleAmountDown(e)}>
          <Remove color="primary" />
        </IconButton>
      )}
      {amount !== 0 && (
        <Typography variant="h6" className={classes.amount}>
          {amount}
        </Typography>
      )}
      <IconButton size="small" onClick={e => handleAmountUp(e)}>
        <Add color="primary" />
      </IconButton>
    </div>
  );
};

export default ProductViewAmountControl;
