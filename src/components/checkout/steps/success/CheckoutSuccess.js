import React, { useEffect } from 'react';
import { Typography, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { formatId } from 'src/helpers/formatOrderId';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'src/components/link/Link';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import GetAppIcon from '@material-ui/icons/GetApp';
import { firebaseMessagingIsSupported as isSupported } from 'src/config/FirebaseConfig';
import { FiCheck } from 'react-icons/fi';
import { useFirebase } from 'src/hooks/firebase';
import { useApp } from 'src/hooks/app';
import { useCheckout } from '../hooks/useCheckout';
import CheckoutSucessPix from './CheckoutSuccessPix';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  actions: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    '& a': {
      display: 'block',
      textAlign: 'center',
      fontSize: 18,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  contentAction: {
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'column',
    '& button': {
      marginTop: 10,
    },
  },
  playStoreImg: {
    width: 150,
  },
  linkFollowOrder: {
    fontSize: 18,
    marginTop: 30,
  },
}));

export default function CheckoutSuccess() {
  const checkout = useCheckout();
  const user = useSelector(state => state.user);
  const order = checkout.createdOrder;
  const classes = useStyles();
  const { isMobile, handleInstallApp, handleCartVisibility, readyToInstall } = useApp();
  const restaurant = useSelector(state => state.restaurant);
  const fm = useFirebase();

  useEffect(() => {
    handleCartVisibility(false);
    if (restaurant.configs.facebook_pixel_id) fbq('track', 'Purchase', { value: order.total, currency: 'BRL' });
  }, [restaurant.configs.facebook_pixel_id, order.total, handleCartVisibility]);

  useEffect(() => {
    gtag('event', 'purchase', {
      affiliation: restaurant?.name,
      coupon: order.coupon?.description,
      currency: 'BRL',
      items: order.products.map(product => ({
        item_id: product.id,
        item_name: product.name,
        coupon: '',
        discount: 0,
        affiliation: restaurant?.name,
        item_brand: '',
        item_category: product.category.name,
        item_variant: '',
        price: product.price,
        currency: 'BRL',
        quantity: product.amount,
      })),
      transaction_id: order.id,
      shipping: order.tax,
      value: order.total,
      tax: 0,
    });
  }, [order, restaurant]);

  return (
    <div className={classes.container}>
      <FiCheck color="#3ac359" size={66} />
      <Typography gutterBottom variant="h5" align="center">
        {user.name}, recebemos seu pedido!
      </Typography>
      <Typography>
        O número do pedido é <strong>{formatId(order.id)}</strong>
      </Typography>

      <Link
        className={classes.linkFollowOrder}
        href="account/orders/[id]"
        as={`account/orders/${order.encrypted_id}`}
        color="primary"
      >
        acompanhar pedido
      </Link>
      {checkout.createdOrder?.pix_payment && <CheckoutSucessPix order={checkout.createdOrder} />}
      <div className={classes.actions}>
        {restaurant && restaurant.play_store_link && isMobile && (
          <div className={classes.contentAction}>
            <Typography variant="body2" color="textSecondary" align="center">
              Baixe o aplicativo {restaurant.name}, gratuíto para celular
            </Typography>
            <a href={restaurant.play_store_link}>
              <img className={classes.playStoreImg} src="/images/play_store.png" alt="Google Play Store" />
            </a>
          </div>
        )}
        {readyToInstall && (
          <div className={classes.contentAction}>
            <Typography align="center" variant="body2" color="textSecondary">
              Adicione esse aplicativo da web na tela inicial do seu celular.
            </Typography>
            <Button color="primary" onClick={handleInstallApp} variant="text" size="medium" startIcon={<GetAppIcon />}>
              Adicionar
            </Button>
          </div>
        )}
        {!fm.fmHasToken && isSupported() && user.id && (
          <div className={classes.contentAction}>
            <Typography align="center" variant="body2" color="textSecondary">
              Ative notificações para acompanhar esse pedido
            </Typography>
            <Button
              color="primary"
              onClick={fm.requestPermissionMessaging}
              variant="text"
              size="medium"
              startIcon={<NotificationsActiveIcon />}
            >
              Ativar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
