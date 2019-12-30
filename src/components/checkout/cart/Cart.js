import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartTotal from 'src/components/cart/CartTotal';
import { makeStyles } from '@material-ui/core/styles';
import ProductSimple from 'src/components/cart/edit/simple/ProductSimple';
import ProductComplement from 'src/components/cart/edit/complements/ProductComplement';
import ProductPizzaComplement from 'src/components/cart/edit/pizza_complement/ProductPizzaComplement';
import { updateProductFromCart } from 'src/store/redux/modules/cart/actions';
import { MessagingContext } from 'src/components/messaging/Messaging';
import CartProductList from 'src/components/cart/CartProductList';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  cart: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 30,
  },
  emptyCart: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '& svg': {
      marginRight: 10,
    },
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

export default function Cart() {
  const cart = useSelector(state => state.cart);
  const classes = useStyles();
  const dispatch = useDispatch();
  const messaging = useContext(MessagingContext);
  const [dialogUpdateSimpleProduct, setDialogUpdateSimpleProduct] = useState(false);
  const [dialogUpdateComplementProduct, setDialogUpdateComplementProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function handleUpdateCartProduct(product, amount) {
    dispatch(updateProductFromCart(product, amount));
    messaging.handleOpen('Atualizado!');
  }

  function handleClickUpdateProduct(product) {
    setSelectedProduct(product);

    if (product.category.has_complement) {
      setDialogUpdateComplementProduct(true);
      return false;
    }

    setDialogUpdateSimpleProduct(true);
  }

  return (
    <>
      {dialogUpdateSimpleProduct && (
        <ProductSimple
          onExited={() => setDialogUpdateSimpleProduct(false)}
          selectedProduct={selectedProduct}
          handleUpdateCartProduct={handleUpdateCartProduct}
        />
      )}
      {dialogUpdateComplementProduct && (
        <>
          {selectedProduct.category.is_pizza ? (
            <ProductPizzaComplement
              onExited={() => setDialogUpdateComplementProduct(false)}
              selectedProduct={selectedProduct}
              handleUpdateCartProduct={handleUpdateCartProduct}
            />
          ) : (
            <ProductComplement
              onExited={() => setDialogUpdateComplementProduct(false)}
              selectedProduct={selectedProduct}
              handleUpdateCartProduct={handleUpdateCartProduct}
            />
          )}
        </>
      )}
      {cart.products.length > 0 ? (
        <div className={classes.cart}>
          <Typography className={classes.title} variant="h5" color="primary">
            Carrinho
          </Typography>
          <CartProductList handleClickUpdateProduct={handleClickUpdateProduct} products={cart.products} />
          <CartTotal />
        </div>
      ) : (
        <div className={classes.emptyCart}>
          <Typography variant="h6" color="textSecondary">
            Carrinho vazio.
          </Typography>
        </div>
      )}
    </>
  );
}
