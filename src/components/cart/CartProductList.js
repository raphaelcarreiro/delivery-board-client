import React from 'react';
import { List, ListItem, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { removeFromCart, restoreCart } from 'src/store/redux/modules/cart/actions';
import CartProductListComplements from './CartProductListComplements';
import { useMessaging } from 'src/hooks/messaging';

const useStyles = makeStyles(theme => ({
  list: {
    paddingTop: 0,
    [theme.breakpoints.down('md')]: {
      paddingBottom: 15,
    },
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '15px 0',
    alignItems: 'flex-start',
    '&:first-child': {
      [theme.breakpoints.down('md')]: {
        padding: '0 0 15px',
      },
    },
    [theme.breakpoints.down('md')]: {
      borderBottom: '1px solid #eee',
      borderTop: 'none',
      padding: '10px 0',
    },
  },
  product: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
    '&>div': {
      display: 'flex',
      alignItems: 'center',
    },
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
  productImage: {
    width: '100%',
  },
  additional: {
    color: '#4CAF50',
    marginRight: 7,
  },
  ingredients: {
    color: '#c53328',
    marginRight: 7,
  },
  options: {
    marginBottom: 10,
  },
  productName: {
    fontWeight: 300,
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
    display: 'flex',
    backgroundColor: '#eee',
  },
}));

CartProductList.propTypes = {
  products: PropTypes.array.isRequired,
  handleClickUpdateProduct: PropTypes.func.isRequired,
};

export default function CartProductList({ products, handleClickUpdateProduct }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const messaging = useMessaging();

  function handleRestoreCart() {
    dispatch(restoreCart());
    messaging.handleClose();
  }

  function handleRemoveFromCart(productUid) {
    dispatch(removeFromCart(productUid));
    messaging.handleOpen('Produto removido', handleRestoreCart);
  }

  return (
    <List className={classes.list}>
      {products.map(product => (
        <ListItem disableGutters key={product.uid} className={classes.listItem}>
          <div className={classes.product} id="product-data">
            <div>
              <div className={classes.imageContainer}>
                {product.image && (
                  <img
                    src={product.image.imageThumbUrl ? product.image.imageThumbUrl : product.image.imageUrl}
                    alt={product.name}
                    className={classes.productImage}
                  />
                )}
              </div>
              <div>
                <Typography variant="h6" className={classes.productName}>
                  {product.amount}x {product.name}
                </Typography>
                {product.promotion && (
                  <>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Você ganhou esse produto!
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Promoção {product.promotion.name}
                    </Typography>
                  </>
                )}
              </div>
            </div>
            <Typography variant="h5" className={classes.price}>
              {product.formattedFinalPrice}
            </Typography>
          </div>
          {product.category.has_complement && <CartProductListComplements categories={product.complement_categories} />}
          {(product.ingredients.some(ingredient => !ingredient.selected) ||
            product.additional.some(additional => additional.selected)) && (
            <div className={classes.options}>
              <div>
                {product.ingredients.map(
                  ingredient =>
                    !ingredient.selected && (
                      <Typography key={ingredient.id} variant="body2" display="inline" className={classes.ingredients}>
                        - {ingredient.name}
                      </Typography>
                    )
                )}
              </div>
              <div>
                {product.additional &&
                  product.additional.map(
                    additional =>
                      additional.selected && (
                        <Typography key={additional.id} variant="body2" display="inline" className={classes.additional}>
                          + {additional.name} {additional.formattedPrice}
                        </Typography>
                      )
                  )}
              </div>
            </div>
          )}
          {!product.promotion && (
            <div className={classes.actions}>
              <Typography onClick={() => handleClickUpdateProduct(product)} color="primary" className={classes.link}>
                Editar
              </Typography>
              <Typography className={classes.link} onClick={() => handleRemoveFromCart(product.uid)}>
                Excluir
              </Typography>
            </div>
          )}
        </ListItem>
      ))}
    </List>
  );
}
