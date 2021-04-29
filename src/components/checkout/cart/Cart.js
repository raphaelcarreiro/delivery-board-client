import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartTotal from 'src/components/cart/CartTotal';
import { makeStyles } from '@material-ui/core/styles';
import ProductSimple from 'src/components/cart/products/detail/simple/ProductSimple';
import ProductComplement from 'src/components/cart/products/detail/complements/ProductComplement';
import ProductPizzaComplement from 'src/components/cart/products/detail/pizza_complement/ProductPizzaComplement';
import { updateProductFromCart } from 'src/store/redux/modules/cart/actions';
import CartProductList from 'src/components/cart/products/CartProductList';
import { Typography } from '@material-ui/core';
import Coupon from 'src/components/cart/coupon/Coupon';
import CartCouponButton from 'src/components/cart/CartCouponButton';
import { CartProvider } from 'src/components/cart/hooks/useCart';

const useStyles = makeStyles(theme => ({
  cart: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    position: 'fixed',
    top: 80,
    bottom: 0,
    width: 400,
    backgroundColor: '#f5f5f5',
    padding: 15,
    [theme.breakpoints.down('sm')]: {
      position: 'relative',
      backgroundColor: '#fff',
      width: '100%',
      padding: 0,
      top: 'unset',
    },
  },
  emptyCart: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
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
  const [dialogUpdateSimpleProduct, setDialogUpdateSimpleProduct] = useState(false);
  const [dialogUpdateComplementProduct, setDialogUpdateComplementProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [couponView, setCouponView] = useState(false);

  function handleUpdateCartProduct(product, amount) {
    dispatch(updateProductFromCart(product, amount));
  }

  function handleClickUpdateProduct(product) {
    setSelectedProduct(product);

    if (product.category.has_complement) {
      setDialogUpdateComplementProduct(true);
      return false;
    }

    setDialogUpdateSimpleProduct(true);
  }

  const cartContextValue = {
    selectedProduct,
    handleUpdateCartProduct,
    setSelectedProduct: product => setSelectedProduct(product),
  };

  return (
    <CartProvider value={cartContextValue}>
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
      {couponView ? (
        <div className={classes.cart}>
          <Coupon setClosedCouponView={() => setCouponView(false)} />
        </div>
      ) : cart.products.length > 0 ? (
        <div className={classes.cart}>
          <Typography className={classes.title} variant="h5" color="primary">
            carrinho
          </Typography>
          <CartProductList handleClickUpdateProduct={handleClickUpdateProduct} products={cart.products} />
          <CartCouponButton setCouponView={setCouponView} />
          <CartTotal />
        </div>
      ) : (
        <div className={classes.emptyCart}>
          <Typography variant="h5" color="textSecondary">
            Carrinho vazio
          </Typography>
        </div>
      )}
    </CartProvider>
  );
}
