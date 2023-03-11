import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartProductList from './products/CartProductList';
import CartTotal from './CartTotal';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import ProductSimple from './products/detail/simple/ProductSimple';
import ProductComplement from './products/detail/complements/ProductComplement';
import ProductPizzaComplement from './products/detail/pizza_complement/ProductPizzaComplement';
import { updateProductFromCart } from 'src/store/redux/modules/cart/actions';
import CustomAppbar from 'src/components/appbar/CustomAppbar';
import CartClosedRestaurant from 'src/components/cart/CartClosedRestaurant';
import Coupon from './coupon/Coupon';
import CartCouponButton from './CartCouponButton';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { useMessaging } from 'src/providers/MessageProvider';
import { useAuth } from 'src/providers/AuthProvider';
import { useApp } from 'src/providers/AppProvider';
import { CartProvider } from './hooks/useCart';

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
    [theme.breakpoints.down('sm')]: {
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
    display: 'block',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
  coupon: {
    textAlign: 'right',
    marginBottom: 15,
  },
  info: {
    display: 'grid',
    gridGap: 7,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginBottom: 50,
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: 10,
    },
  },
}));

export default function Cart() {
  const cart = useSelector(state => state.cart);
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const messaging = useMessaging();
  const { handleCartVisibility, setRedirect } = useApp();
  const restaurant = useSelector(state => state.restaurant);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogClosedRestaurant, setDialogClosedRestaurant] = useState(false);
  const [couponView, setCouponView] = useState(false);
  const { isAuthenticated } = useAuth();

  const isPizza = useMemo(() => {
    return !!selectedProduct?.category.is_pizza;
  }, [selectedProduct]);

  const isComplement = useMemo(() => {
    return !!selectedProduct?.category.has_complement && !selectedProduct?.category.is_pizza;
  }, [selectedProduct]);

  const isSimple = useMemo(() => {
    return selectedProduct ? !selectedProduct.category.has_complement : false;
  }, [selectedProduct]);

  function handleCheckoutClick() {
    if (!restaurant.is_open) {
      setDialogClosedRestaurant(true);
      return;
    }

    if (restaurant.configs.order_minimum_value > cart.subtotal && restaurant.configs.tax_mode !== 'order_value') {
      messaging.handleOpen(`O valor mínimo do pedido é ${restaurant.configs.formattedOrderMinimumValue}`);
      return;
    }

    if (
      restaurant.configs.tax_mode !== 'products_amount' &&
      restaurant.configs.order_minimum_products_amount > cart.productsAmount
    ) {
      messaging.handleOpen(`A quantidade mínima de produtos é ${restaurant.configs.order_minimum_products_amount}`);
      return;
    }

    if (!isAuthenticated) {
      if (restaurant.configs.require_login) {
        router.push('/login');
        setRedirect('/checkout');
        return;
      }
      router.push('/guest-register');
      setRedirect('/checkout');
      return;
    }

    router.push('/checkout');
  }

  function handleUpdateCartProduct(product, amount) {
    dispatch(updateProductFromCart(product, amount));
  }

  function handleClickUpdateProduct(product) {
    messaging.handleClose();

    setSelectedProduct(product);
  }

  function handleBuyingClick() {
    handleCartVisibility(false);
  }

  const cartContextValue = {
    selectedProduct,
    handleUpdateCartProduct: handleUpdateCartProduct,
    setSelectedProduct: product => setSelectedProduct(product),
  };

  return (
    <CartProvider value={cartContextValue}>
      {router.route === '/cart' && <CustomAppbar title="carrinho" />}
      {dialogClosedRestaurant && <CartClosedRestaurant onExited={() => setDialogClosedRestaurant(false)} />}
      {isSimple && <ProductSimple onExited={() => setSelectedProduct(null)} />}
      {isPizza && <ProductPizzaComplement onExited={() => setSelectedProduct(null)} />}
      {isComplement && <ProductComplement onExited={() => setSelectedProduct(null)} />}
      {couponView ? (
        <>
          <Coupon setClosedCouponView={() => setCouponView(false)} />
        </>
      ) : cart.products.length > 0 ? (
        <div className={classes.cart}>
          <Typography className={classes.title} variant="h5" color="primary">
            carrinho
          </Typography>
          <CartProductList handleClickUpdateProduct={handleClickUpdateProduct} products={cart.products} />
          <CartCouponButton setCouponView={setCouponView} />
          <CartTotal />
          <div className={classes.action}>
            <Button disabled size="large" onClick={handleCheckoutClick} variant="contained" color="primary" fullWidth>
              enviar pedido
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
          <Typography variant="h5" color="textSecondary">
            carrinho vazio
          </Typography>
        </div>
      )}
    </CartProvider>
  );
}
