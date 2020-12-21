import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ProductAmountControl from './CartProductAmountControl';
import CartProductUpdateButton from './CartProductUpdateButton';
import { Product } from 'src/types/product';

const useStyles = makeStyles(theme => ({
  actionContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 15,
  },
  action: {
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      position: 'fixed',
    },
  },
}));

type CartProductUpdateProps = {
  handleAmountDown(): void;
  handleAmountUp(): void;
  amount: number;
  product: Product;
  total: string;
  redirect?: boolean;
};

const CartProductUpdate: React.FC<CartProductUpdateProps> = ({
  handleAmountDown,
  handleAmountUp,
  amount,
  product,
  total,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.action}>
      <Grid item xs={12}>
        <div className={classes.actionContent}>
          <ProductAmountControl amount={amount} handleAmountDown={handleAmountDown} handleAmountUp={handleAmountUp} />
          <CartProductUpdateButton product={product} total={total} amount={amount} />
        </div>
      </Grid>
    </div>
  );
};

export default CartProductUpdate;
