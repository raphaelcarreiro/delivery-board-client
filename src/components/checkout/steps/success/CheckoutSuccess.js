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

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  },
  actions: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    '& a': {
      display: 'block',
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 18,
    },
  },
  contentAction: {
    borderRadius: 4,
    padding: 15,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'column',
    border: '1px solid #eee',
    '& button': {
      marginTop: 10,
    },
  },
}));

export default function CheckoutSuccess() {
  const checkout = useContext(CheckoutContext);
  const user = useSelector(state => state.user);
  const order = checkout.createdOrder;
  const classes = useStyles();
  const app = useContext(AppContext);

  useEffect(() => {
    app.handleCartVisibility(false);
  }, []);

  return (
    <div className={classes.container}>
      <Typography gutterBottom variant="h4">
        {user.name}, recebemos seu pedido!
      </Typography>
      <Typography variant="h6">O número do pedido é {formatId(order.id)}</Typography>
      <div className={classes.actions}>
        <Link href="account/orders/[id]" as={`account/orders/${order.encrypted_id}`} color="primary">
          Acompanhar pedido
        </Link>
        {app.readyToInstall && (
          <div className={classes.contentAction}>
            <Typography>Que tal instalar esse aplicativo?</Typography>
            <Button
              color="primary"
              onClick={app.handleInstallApp}
              variant="contained"
              size="medium"
              startIcon={<GetAppIcon />}
            >
              Instalar
            </Button>
          </div>
        )}
        {!app.fmHasToken && isSupported && user.id && (
          <div className={classes.contentAction}>
            <Typography>Ativar notificações para acompanhar esse pedido</Typography>
            <Button
              color="primary"
              onClick={app.handleRequestPermissionMessaging}
              variant="contained"
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
