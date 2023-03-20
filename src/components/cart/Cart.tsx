import React, { useMemo, useState, FC } from 'react';
import { useDispatch } from 'react-redux';
import CartProductList from './products/CartProductList';
import CartTotal from './CartTotal';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import ProductSimple from './products/detail/simple/ProductSimple';
import ProductComplement from './products/detail/complements/ProductComplement';
import ProductPizzaComplement from './products/detail/pizza_complement/ProductPizzaComplement';
import { clearCart, updateProductFromCart } from 'src/store/redux/modules/cart/actions';
import CustomAppbar from 'src/components/appbar/CustomAppbar';
import CartClosedRestaurant from 'src/components/cart/CartClosedRestaurant';
import Coupon from './coupon/Coupon';
import CartCouponButton from './CartCouponButton';
import { useMessaging } from 'src/providers/MessageProvider';
import { CartProvider } from './hooks/useCart';
import CartButtons from './CartButtonts';
import { useSelector } from 'src/store/redux/selector';
import { CartProduct } from 'src/types/cart';
import CartCustomer from './customer/CartCustomer';
import { api } from 'src/services/api';
import packageJson from '../../../package.json';
import { setBoardCustomer } from 'src/store/redux/modules/boardMovement/actions';
import { useApp } from 'src/providers/AppProvider';
import CartSuccess from './CartSuccess';

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

const Cart: FC = () => {
  const cart = useSelector(state => state.cart);
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const messaging = useMessaging();
  const restaurant = useSelector(state => state.restaurant);
  const movement = useSelector(state => state.boardMovement);
  const [selectedProduct, setSelectedProduct] = useState<CartProduct | null>(null);
  const [dialogClosedRestaurant, setDialogClosedRestaurant] = useState(false);
  const [couponView, setCouponView] = useState(false);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const cartContextValue = {
    selectedProduct,
    handleUpdateCartProduct,
    setSelectedProduct: (product: CartProduct) => setSelectedProduct(product),
    setShowCustomerDialog,
    saving,
    handleSubmit,
  };

  const isPizza = useMemo(() => {
    return !!selectedProduct?.category.is_pizza;
  }, [selectedProduct]);

  const isComplement = useMemo(() => {
    return !!selectedProduct?.category.has_complement && !selectedProduct?.category.is_pizza;
  }, [selectedProduct]);

  const isSimple = useMemo(() => {
    return selectedProduct ? !selectedProduct.category.has_complement : false;
  }, [selectedProduct]);

  function handleUpdateCartProduct(product: CartProduct, amount: number) {
    dispatch(updateProductFromCart(product, amount));
  }

  function handleClickUpdateProduct(product: CartProduct) {
    messaging.handleClose();

    setSelectedProduct(product);
  }

  function handleSubmit() {
    if (!movement) {
      return;
    }

    setSaving(true);

    const data = {
      customer: movement.customer,
      payment_method: null,
      shipment: {
        ...restaurant?.addresses.find(address => address.is_main),
        shipment_method: 'board',
      },
      products: cart.products,
      board_movement_id: movement.id,
      total: cart.total,
      discount: cart.discount,
      change: 0,
      tax: cart.tax,
      origin: {
        version: packageJson.version,
        app_name: packageJson.name,
        platform: 'board-web-app',
      },
    };

    api
      .post(`/boardMovements/${movement.id}/orders`, data)
      .then(response => {
        dispatch(setBoardCustomer(response.data.customer.name));
        dispatch(clearCart());
        setSuccess(true);
      })
      .catch(err => console.error(err))
      .finally(() => setSaving(false));
  }

  return (
    <CartProvider value={cartContextValue}>
      {router.route === '/cart' && <CustomAppbar title="carrinho" />}

      {dialogClosedRestaurant && <CartClosedRestaurant onExited={() => setDialogClosedRestaurant(false)} />}

      {isSimple && <ProductSimple onExited={() => setSelectedProduct(null)} />}

      {isPizza && <ProductPizzaComplement onExited={() => setSelectedProduct(null)} />}

      {isComplement && <ProductComplement onExited={() => setSelectedProduct(null)} />}

      {showCustomerDialog && <CartCustomer onExited={() => setShowCustomerDialog(false)} />}

      {success ? (
        <CartSuccess />
      ) : couponView ? (
        <Coupon setClosedCouponView={() => setCouponView(false)} />
      ) : cart.products.length ? (
        <div className={classes.cart}>
          <Typography className={classes.title} variant="h5" color="primary">
            carrinho
          </Typography>

          <CartProductList handleClickUpdateProduct={handleClickUpdateProduct} products={cart.products} />

          <CartCouponButton setCouponView={setCouponView} />

          <CartTotal />

          <CartButtons setDialogClosedRestaurant={setDialogClosedRestaurant} />
        </div>
      ) : (
        <div className={classes.emptyCart}>
          <Typography variant="body1" color="textSecondary">
            carrinho vazio
          </Typography>
        </div>
      )}
    </CartProvider>
  );
};

export default Cart;
