import React, { useState } from 'react';
import { List, ListItem, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { removeFromCart } from 'src/store/redux/modules/cart/actions';
import CartProductListComplements from './CartProductListComplements';

const useStyles = makeStyles(theme => ({
  list: {},
  listItem: {
    display: 'flex',
    // borderTop: '1px solid #eee',
    flexDirection: 'column',
    padding: 15,
    boxShadow: '1px 1px 3px 0px #ddd',
    borderRadius: 4,
    marginBottom: 10,
  },
  product: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
    '&>div': {
      display: 'flex',
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
    width: 30,
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
}));

CartProductList.propTypes = {
  products: PropTypes.array.isRequired,
  handleClickUpdateProduct: PropTypes.func.isRequired,
};

export default function CartProductList({ products, handleClickUpdateProduct }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showImageZoom, setShowImageZoom] = useState(false);

  function handleRemoveFromCart(productUid) {
    dispatch(removeFromCart(productUid));
  }

  function handleImageMouseEnter(event) {
    setShowImageZoom(true);
  }

  function handleImageMouseLeave() {
    setShowImageZoom(false);
  }

  function handleImageMouseMove() {
    const productDataPosition = document.getElementById('product-data');
    const imageZoom = document.getElementById('image-zoom');
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
                id="image-zoom"
              />
              <img
                onMouseEnter={handleImageMouseEnter}
                onMouseLeave={handleImageMouseLeave}
                onMouseMoveCapture={handleImageMouseMove}
                src={product.image.imageUrl}
                alt={product.name}
                className={classes.productImage}
              />
              <Typography variant="h6">
                {product.amount} {product.name}
              </Typography>
            </div>
            <Typography variant="h5" className={classes.price}>
              {product.formattedFinalPrice}
            </Typography>
          </div>
          {product.category.has_complement && <CartProductListComplements categories={product.complement_categories} />}
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
