import React, { FC } from 'react';
import { List, makeStyles } from '@material-ui/core';
import CartProductItem from './CartProductItem';

const useStyles = makeStyles(theme => ({
  list: {
    paddingTop: 0,
    [theme.breakpoints.down('md')]: {
      paddingBottom: 15,
    },
  },
}));

interface CartProductListProps {
  products: any[];
  handleClickUpdateProduct(product: any): void;
}

const CartProductList: FC<CartProductListProps> = ({ products, handleClickUpdateProduct }) => {
  const classes = useStyles();

  return (
    <List className={classes.list}>
      {products.map(product => (
        <CartProductItem product={product} handleClickUpdateProduct={handleClickUpdateProduct} key={product.uid} />
      ))}
    </List>
  );
};

export default CartProductList;
