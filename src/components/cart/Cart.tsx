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
import { setBoardCustomer } from 'src/store/redux/modules/boardMovement/actions';
import CartSuccess from './CartSuccess';
import CartError from './CartError';
import { getOrderDataToSubmit } from './getOrderDataToSubmit';
import InsideSaving from '../loading/InsideSaving';
import CartHeader from './CartHeader';

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
  header: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
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
  const [error, setError] = useState('');

  const cartContextValue = {
    selectedProduct,
    handleUpdateCartProduct,
    setSelectedProduct: (product: CartProduct) => setSelectedProduct(product),
    setShowCustomerDialog,
    saving,
    handleSubmit,
    setError,
    error,
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

  function formatOrderData(customerName?: string) {
    if (!movement) {
      return null;
    }

    if (!restaurant) {
      return null;
    }

    const data = getOrderDataToSubmit(cart, movement, restaurant);

    if (!customerName) {
      return data;
    }

    return {
      ...data,
      customer_name: customerName,
      customer: {
        name: customerName,
      } as any,
    };
  }

  function handleSubmit(customerName?: string) {
    if (saving) {
      return;
    }

    const data = formatOrderData(customerName);

    if (!data) {
      return;
    }

    if (!movement) {
      return;
    }

    setSaving(true);

    api
      .post(`/boardMovements/${movement.id}/orders`, data)
      .then(response => {
        dispatch(setBoardCustomer(response.data.customer.name));
        dispatch(clearCart());
        setSuccess(true);
      })
      .catch(err => {
        setError(err.response?.data?.error ? err.response.data.error : 'Não foi possível enviar o pedido');
      })
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

      {saving && <InsideSaving />}

      {error ? (
        <CartError textError={error} handleReset={() => setError('')} />
      ) : success ? (
        <CartSuccess />
      ) : couponView ? (
        <Coupon setClosedCouponView={() => setCouponView(false)} />
      ) : cart.products.length ? (
        <div className={classes.cart}>
          <CartHeader />

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
