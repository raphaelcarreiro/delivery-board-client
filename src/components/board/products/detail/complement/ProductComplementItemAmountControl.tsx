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

type ProductComplementItemAmountControlProps = {
  handleClickComplements(complementCategoryId: number, complementId: number, amount: number): void;
  complementCategoryId: number;
  complementId: number;
  maxQuantity: number;
  amountSelected: number;
};

const ProductComplementItemAmountControl: React.FC<ProductComplementItemAmountControlProps> = ({
  handleClickComplements,
  complementCategoryId,
  complementId,
  maxQuantity,
  amountSelected,
}) => {
  const classes = useStyles();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    handleClickComplements(complementCategoryId, complementId, amount);
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
      <IconButton
        style={amountSelected >= maxQuantity ? { opacity: 0.5 } : undefined}
        disabled={amountSelected >= maxQuantity}
        size="small"
        onClick={e => handleAmountUp(e)}
      >
        <Add color="primary" />
      </IconButton>
    </div>
  );
};

export default ProductComplementItemAmountControl;
