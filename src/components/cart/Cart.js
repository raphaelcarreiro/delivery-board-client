import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartProductList from './CartProductList';
import CartTotal from './CartTotal';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import ProductSimple from './edit/simple/ProductSimple';
import { MessagingContext } from '../messaging/Messaging';
import ProductComplement from './edit/complements/ProductComplement';
import ProductPizzaComplement from './edit/pizza_complement/ProductPizzaComplement';
import { updateProductFromCart } from 'src/store/redux/modules/cart/actions';

const useStyles = makeStyles({
  cart: {
    display: 'flex',
    flexDirection: 'column',
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
  },
  action: {
    marginTop: 20,
  },
});

export default function Cart() {
  const cart = useSelector(state => state.cart);
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const messaging = useContext(MessagingContext);
  const [dialogUpdateSimpleProduct, setDialogUpdateSimpleProduct] = useState(false);
  const [dialogUpdateComplementProduct, setDialogUpdateComplementProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function handleCheckoutClick() {
    router.push('/checkout');
  }

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
          <Typography className={classes.title} variant="h6">
            Minha cesta
          </Typography>
          <CartProductList handleClickUpdateProduct={handleClickUpdateProduct} products={cart.products} />
          <CartTotal />
          <div className={classes.action}>
            <Button size="large" onClick={handleCheckoutClick} variant="contained" color="primary" fullWidth>
              Fechar pedido
            </Button>
          </div>
        </div>
      ) : (
        <div className={classes.emptyCart}>
          <Typography variant="h6" color="textSecondary">
            Cesta vazia.
          </Typography>
        </div>
      )}
    </>
  );
}
