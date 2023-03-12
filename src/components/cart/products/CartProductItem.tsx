import React, { FC } from 'react';
import { ListItem, Typography, makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { removeFromCart } from 'src/store/redux/modules/cart/actions';
import CartProductListComplements from './CartProductListComplements';

const useStyles = makeStyles((theme) => ({
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '15px 0',
    alignItems: 'flex-start',
    '&:first-child': {
      [theme.breakpoints.down('sm')]: {
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
    flexShrink: 0,
  },
}));

interface CartProductItemProps {
  product: any;
  handleClickUpdateProduct(product: any): void;
}

const CartProductItem: FC<CartProductItemProps> = ({ product, handleClickUpdateProduct }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  function handleRemoveFromCart(productUid: number) {
    dispatch(removeFromCart(productUid));
  }

  function showAdditionalOrIngredients(product) {
    const showIngredients = product.ingredients.some((ingredient) => !ingredient.selected);
    const showAdditional = product.additional.some((additional) => additional.selected);
    return showAdditional || showIngredients;
  }

  return (
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
                  você ganhou esse produto!
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  promoção {product.promotion.name}
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

      {showAdditionalOrIngredients(product) && (
        <div className={classes.options}>
          <div>
            {product.ingredients
              .filter((ingredient) => !ingredient.selected)
              .map((ingredient) => (
                <Typography key={ingredient.id} variant="body2" display="inline" className={classes.ingredients}>
                  s/ {ingredient.name}
                </Typography>
              ))}
          </div>

          <div>
            {product.additional
              .filter((additional) => additional.selected)
              .map((additional) => (
                <Typography key={additional.id} variant="body2" display="inline" className={classes.additional}>
                  c/ {additional.amount}x {additional.name}
                </Typography>
              ))}
          </div>
        </div>
      )}

      {!product.promotion && (
        <div className={classes.actions}>
          <Typography onClick={() => handleClickUpdateProduct(product)} color="primary" className={classes.link}>
            editar
          </Typography>
          <Typography className={classes.link} onClick={() => handleRemoveFromCart(product.uid)}>
            excluir
          </Typography>
        </div>
      )}
    </ListItem>
  );
};

export default CartProductItem;
