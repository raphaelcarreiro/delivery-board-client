import React from 'react';
import { List, ListItem, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { removeFromCart } from 'src/store/redux/modules/cart/actions';

const useStyles = makeStyles({
  listItem: {
    display: 'flex',
    borderBottom: '1px solid #eee',
    flexDirection: 'column',
    padding: '20px 0',
  },
  product: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  price: {
    fontWeight: 300,
  },
  link: {
    cursor: 'pointer',
  },
  linkError: {
    color: 'red',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    '& p': {
      marginRight: 15,
    },
    width: '100%',
  },
});

CartProductList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default function CartProductList({ products }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  function handleRemoveFromCart(productUid) {
    dispatch(removeFromCart(productUid));
  }

  return (
    <List>
      {products.map(product => (
        <ListItem disableGutters key={product.uid} className={classes.listItem}>
          <div className={classes.product}>
            <Typography>
              {product.amount}x {product.name}
            </Typography>
            <Typography className={classes.price}>{product.formattedFinalPrice}</Typography>
          </div>
          <div className={classes.actions}>
            <Typography color="primary" className={classes.link}>
              Editar
            </Typography>
            <Typography
              className={`${classes.link} ${classes.linkError}`}
              onClick={() => handleRemoveFromCart(product.uid)}
            >
              Excluir
            </Typography>
          </div>
        </ListItem>
      ))}
    </List>
  );
}
