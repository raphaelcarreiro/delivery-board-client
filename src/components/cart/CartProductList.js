import React, { useState, useContext } from 'react';
import { List, ListItem, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { removeFromCart, restoreCart } from 'src/store/redux/modules/cart/actions';
import CartProductListComplements from './CartProductListComplements';
import { MessagingContext } from 'src/components/messaging/Messaging';

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
    width: 40,
    height: 40,
    borderRadius: '50%',
    alignItems: 'center',
    marginRight: 10,
  },
  imageZoom: {
    width: 100,
    position: 'fixed',
    borderRadius: 4,
    zIndex: 15,
  },
  additional: {
    color: '#4CAF50',
  },
  ingredients: {
    color: '#c53328',
  },
  options: {
    padding: '0 0 10px 10px',
  },
  productName: {
    fontWeight: 300,
  },
}));

CartProductList.propTypes = {
  products: PropTypes.array.isRequired,
  handleClickUpdateProduct: PropTypes.func.isRequired,
};

export default function CartProductList({ products, handleClickUpdateProduct }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const messaging = useContext(MessagingContext);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showImageZoom, setShowImageZoom] = useState(false);

  function handleRestoreCart() {
    dispatch(restoreCart());
    messaging.handleClose();
    // messaging.handleOpen('Carrinho recuperado');
  }

  function handleRemoveFromCart(productUid) {
    dispatch(removeFromCart(productUid));
    messaging.handleOpen('Produto removido', handleRestoreCart);
  }

  function handleImageMouseEnter(event) {
    setShowImageZoom(true);
  }

  function handleImageMouseLeave() {
    setShowImageZoom(false);
  }

  function handleImageMouseMove(productUid) {
    const productDataPosition = document.getElementById('product-data');
    const imageZoom = document.getElementById(`image-zoom-${productUid}`);
    setMousePosition({
      x: event.clientX - productDataPosition.scrollLeft - imageZoom.scrollWidth - 10,
      y: event.clientY - productDataPosition.scrollTop - imageZoom.scrollHeight - 10,
    });
  }

  return (
    <List className={classes.list}>
      {products.map(product => (
        <ListItem disableGutters key={product.uid} className={classes.listItem}>
          <div className={classes.product} id="product-data">
            <div>
              <img
                style={{ top: mousePosition.y, left: mousePosition.x, display: showImageZoom ? 'block' : 'none' }}
                src={product.image.imageUrl}
                alt={product.name}
                className={classes.imageZoom}
                id={`image-zoom-${product.uid}`}
              />
              <img
                onMouseEnter={handleImageMouseEnter}
                onMouseLeave={handleImageMouseLeave}
                onMouseMoveCapture={() => handleImageMouseMove(product.uid)}
                src={product.image.imageUrl}
                alt={product.name}
                className={classes.productImage}
              />
              <Typography variant="h6" className={classes.productName}>
                {product.amount}x {product.name}
              </Typography>
            </div>
            <Typography variant="h5" className={classes.price}>
              {product.formattedFinalPrice}
            </Typography>
          </div>
          {product.category.has_complement && <CartProductListComplements categories={product.complement_categories} />}
          {(product.ingredients.some(ingredient => !ingredient.selected) ||
            product.additional.some(additional => additional.selected)) && (
            <div className={classes.options}>
              {product.ingredients.map(
                ingredient =>
                  !ingredient.selected && (
                    <Typography key={ingredient.id} variant="body2" display="block" className={classes.ingredients}>
                      - {ingredient.name}
                    </Typography>
                  )
              )}
              {product.additional &&
                product.additional.map(
                  additional =>
                    additional.selected && (
                      <Typography key={additional.id} variant="body2" display="block" className={classes.additional}>
                        + {additional.name} {additional.formattedPrice}
                      </Typography>
                    )
                )}
            </div>
          )}
          <div className={classes.actions}>
            <Typography onClick={() => handleClickUpdateProduct(product)} color="primary" className={classes.link}>
              Editar
            </Typography>
            <Typography className={classes.link} onClick={() => handleRemoveFromCart(product.uid)}>
              Excluir
            </Typography>
          </div>
        </ListItem>
      ))}
    </List>
  );
}
