import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartProductList from './CartProductList';
import CartTotal from './CartTotal';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Chip } from '@material-ui/core';
import { useRouter } from 'next/router';
import ProductSimple from './edit/simple/ProductSimple';
import { MessagingContext } from '../messaging/Messaging';
import ProductComplement from './edit/complements/ProductComplement';
import ProductPizzaComplement from './edit/pizza_complement/ProductPizzaComplement';
import { updateProductFromCart } from 'src/store/redux/modules/cart/actions';
import CustomAppbar from 'src/components/appbar/CustomAppbar';
import CartClosedRestaurant from 'src/components/cart/CartClosedRestaurant';
import { AppContext } from 'src/App';
import { isAuthenticated } from 'src/services/auth';
import Coupon from './coupon/Coupon';
import CartCouponButton from './CartCouponButton';

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
  action: {
    marginTop: 20,
    '& button': {
      marginBottom: 10,
    },
  },
  buying: {
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
  coupon: {
    textAlign: 'right',
    marginBottom: 15,
  },
}));

export default function Cart() {
  const cart = useSelector(state => state.cart);
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const messaging = useContext(MessagingContext);
  const app = useContext(AppContext);
  const restaurant = useSelector(state => state.restaurant);
  const [dialogUpdateSimpleProduct, setDialogUpdateSimpleProduct] = useState(false);
  const [dialogUpdateComplementProduct, setDialogUpdateComplementProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogClosedRestaurant, setDialogClosedRestaurant] = useState(false);
  const [couponView, setCouponView] = useState(false);

  function handleCheckoutClick() {
    if (!restaurant.is_open) {
      setDialogClosedRestaurant(true);
      return;
    }

    if (restaurant.minimum_order > cart.total) {
      messaging.handleOpen(`O valor mínimo do pedido é ${restaurant.formattedMinimumOrder}`);
      return;
    }

    if (!isAuthenticated()) {
      if (restaurant.configs.require_login) {
        router.push('/login');
        app.setRedirect('/checkout');
        return;
      }
      router.push('/guest-register');
      app.setRedirect('/checkout');
      return;
    }

    router.push('/checkout');
  }

  function handleUpdateCartProduct(product, amount) {
    dispatch(updateProductFromCart(product, amount));
    messaging.handleOpen('Atualizado!');
  }

  function handleClickUpdateProduct(product) {
    messaging.handleClose();

    setSelectedProduct(product);

    if (product.category.has_complement) {
      setDialogUpdateComplementProduct(true);
      return false;
    }

    setDialogUpdateSimpleProduct(true);
  }

  function handleBuyingClick() {
    app.handleCartVisibility(false);
  }

  return (
    <>
      {router.route === '/cart' && <CustomAppbar title="Carrinho" />}
      {dialogClosedRestaurant && <CartClosedRestaurant onExited={() => setDialogClosedRestaurant(false)} />}
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
        <>
          <Coupon setClosedCouponView={() => setCouponView(false)} />
        </>
      ) : cart.products.length > 0 ? (
        <div className={classes.cart}>
          <Typography className={classes.title} variant="h5" color="primary">
            Carrinho
          </Typography>
          <CartProductList handleClickUpdateProduct={handleClickUpdateProduct} products={cart.products} />
          <CartCouponButton setCouponView={setCouponView} />
          <CartTotal />
          <div className={classes.action}>
            <Button size="large" onClick={handleCheckoutClick} variant="contained" color="primary" fullWidth>
              Fechar pedido
            </Button>
            <Button
              variant="text"
              color="primary"
              size="large"
              fullWidth
              className={classes.buying}
              onClick={() => {
                router.route === '/cart' ? router.push('/menu') : handleBuyingClick();
              }}
            >
              Continuar comprando
            </Button>
          </div>
        </div>
      ) : (
        <div className={classes.emptyCart}>
          <Typography variant="h6" color="textSecondary">
            Carrinho vazio
          </Typography>
        </div>
      )}
    </>
  );
}
