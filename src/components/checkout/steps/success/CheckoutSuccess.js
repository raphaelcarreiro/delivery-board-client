import React, { useContext, useEffect } from 'react';
import { CheckoutContext } from 'src/components/checkout/Checkout';
import { Typography, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { formatId } from 'src/helpers/formatOrderId';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from 'src/App';
import Link from 'src/components/link/Link';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import GetAppIcon from '@material-ui/icons/GetApp';
import { firebaseMessagingIsSupported as isSupported } from 'src/config/FirebaseConfig';
import { FiCheck } from 'react-icons/fi';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  followOrder: {
    marginBottom: 20,
  },
}));

export default function CheckoutSuccess() {
  const checkout = useContext(CheckoutContext);
  const user = useSelector(state => state.user);
  const order = checkout.createdOrder;
  const classes = useStyles();
  const app = useContext(AppContext);
  const restaurant = useSelector(state => state.restaurant);

  useEffect(() => {
    app.handleCartVisibility(false);
    if (restaurant.configs.facebook_pixel_id) fbq('track', 'Purchase', { value: order.total, currency: 'BRL' });
  }, [app, restaurant.configs.facebook_pixel_id, order.total]);

  return (
    <div className={classes.container}>
      <FiCheck color="#3ac359" size={66} />
      <Typography gutterBottom variant="h5" align="center">
        {user.name}, recebemos seu pedido!
      </Typography>
      <Typography>
        O número do pedido é <strong>{formatId(order.id)}</strong>
      </Typography>
      <div className={classes.actions}>
        <Link
          className={classes.followOrder}
          href="account/orders/[id]"
          as={`account/orders/${order.encrypted_id}`}
          color="primary"
        >
          Acompanhar pedido
        </Link>
        {restaurant && restaurant.play_store_link && app.isMobile && (
          <div className={classes.contentAction}>
            <Typography variant="body2" color="textSecondary" align="center">
              Baixe o aplicativo {restaurant.name}, gratuíto para celular
            </Typography>
            <a href={restaurant.play_store_link}>
              <img className={classes.playStoreImg} src="/images/play_store.png" alt="Google Play Store" />
            </a>
          </div>
        )}
        <div className={classes.contentAction}>
          <Typography align="center" variant="body2" color="textSecondary">
            Adicione esse app à área de trabalho do seu celular
          </Typography>
          <Button
            color="primary"
            onClick={app.handleInstallApp}
            variant="text"
            size="medium"
            startIcon={<GetAppIcon />}
          >
            Adicionar
          </Button>
        </div>
        {!app.fmHasToken && isSupported && user.id && (
          <div className={classes.contentAction}>
            <Typography align="center" variant="body2" color="textSecondary">
              Ative notificações para acompanhar esse pedido
            </Typography>
            <Button
              color="primary"
              onClick={app.handleRequestPermissionMessaging}
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
