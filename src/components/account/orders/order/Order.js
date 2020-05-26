import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Button } from '@material-ui/core';
import PageHeader from 'src/components/pageHeader/PageHeader';
import { formatId } from 'src/helpers/formatOrderId';
import { api } from 'src/services/api';
import Loading from 'src/components/loading/Loading';
import { format, parseISO } from 'date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import { makeStyles } from '@material-ui/core/styles';
import { moneyFormat } from 'src/helpers/numberFormat';
import CustomAppbar from 'src/components/appbar/CustomAppbar';
import io from 'socket.io-client';
import { MessagingContext } from 'src/components/messaging/Messaging';
import { useSelector } from 'react-redux';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { AppContext } from 'src/App';
import { firebaseMessagingIsSupported as isSupported } from 'src/config/FirebaseConfig';
import OrderAction from './OrderAction';
import OrderProductList from './OrderProductList';
import Link from 'src/components/link/Link';

import OrderStatusList from './OrderStatusList';
import OrderShipment from './OrderShipment';
import OrderPayment from './OrderPayment';

const useStyles = makeStyles(theme => ({
  section: {
    marginBottom: 15,
    padding: 10,
    border: '1px solid #eee',
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    maxWidth: 900,
    width: '100%',
  },
  containerGrid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gridGap: 6,
    width: '100%',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  orderNotFound: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  activeNotifications: {
    position: 'absolute',
    right: 0,
    width: 200,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: 10,
    borderRadius: 4,
    '& button': {
      marginTop: 10,
    },
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

Order.propTypes = {
  cryptId: PropTypes.string.isRequired,
};

export default function Order({ cryptId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.user);
  const app = useContext(AppContext);
  const messaging = useContext(MessagingContext);
  const classes = useStyles();

  useEffect(() => {
    const socket = io.connect(process.env.URL_NODE_SERVER + '/client');
    if (order) {
      socket.emit('register', order.id);

      socket.on('orderStatusChange', status => {
        const statusOrder = status.reverse().map(status => {
          const statusDate = parseISO(status.created_at);
          status.formattedDate = format(statusDate, "PP 'às' p", { locale: ptbr });
          return status;
        });
        setOrder(oldOrder =>
          oldOrder.id === statusOrder[0].order_id ? { ...oldOrder, order_status: statusOrder } : oldOrder
        );
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [order]);

  useEffect(() => {
    handleSetOrders();
  }, []);

  function handleSetOrders() {
    setLoading(true);
    api()
      .get(`orders/${cryptId}`)
      .then(response => {
        const _order = response.data;
        const formattedId = formatId(_order.id);
        document.title = `Pedido ${formattedId}`;

        const date = parseISO(_order.created_at);

        setOrder({
          ..._order,
          formattedId,
          formattedDate: format(date, "PP 'às' p", { locale: ptbr }),
          formattedChange: moneyFormat(_order.change),
          formattedTax: moneyFormat(_order.tax),
          products: _order.products.map(product => {
            product.formattedFinalPrice = moneyFormat(product.final_price);
            product.formattedPrice = moneyFormat(product.price);
            product.formattedProductPrice = moneyFormat(product.product_price);
            product.complement_categories = product.complement_categories.map(category => {
              category.complements = category.complements.map(complement => {
                complement.formattedPrice = moneyFormat(complement.price);
                complement.additional = complement.additional.map(additional => {
                  additional.formttedPrice = moneyFormat(additional.price);
                  return additional;
                });
                return complement;
              });
              return category;
            });
            product.additional = product.additional.map(additional => {
              additional.formattedPrice = moneyFormat(additional.price);
              return additional;
            });
            return product;
          }),
          formattedSubtotal: moneyFormat(_order.subtotal),
          formattedDiscount: moneyFormat(_order.discount),
          formattedTotal: moneyFormat(_order.total),
          shipment: {
            ..._order.shipment,
            formattedScheduledAt: _order.shipment.scheduled_at
              ? format(parseISO(_order.shipment.scheduled_at), 'HH:mm')
              : null,
          },
          order_status: _order.order_status.reverse().map(status => {
            const statusDate = parseISO(status.created_at);
            status.formattedDate = format(statusDate, "PP 'às' p", { locale: ptbr });
            return status;
          }),
        });
      })
      .catch(err => {
        if (err.response)
          if (err.response.status === 404) {
            document.title = 'Pedido não encontrado!';
            messaging.handleOpen('Pedido não encontrado');
          } else messaging.handleOpen('Não foi possível carregar o pedido');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <CustomAppbar
        title={order ? `Pedido ${order.formattedId}` : 'Carregando...'}
        actionComponent={
          <OrderAction
            hasToken={app.fmHasToken}
            isSupported={isSupported()}
            user={!!user.id}
            handleRefresh={handleSetOrders}
            loading={loading}
          />
        }
      />
      {loading ? (
        <Loading />
      ) : order ? (
        <Grid container>
          {!app.fmHasToken && isSupported() && user.id && (
            <div className={classes.activeNotifications}>
              <Typography variant="body2" color="textSecondary" align="center">
                Ative notificações para acompanhar esse pedido
              </Typography>
              <Button
                color="primary"
                onClick={app.handleRequestPermissionMessaging}
                variant="contained"
                size="small"
                startIcon={<NotificationsActiveIcon />}
              >
                Ativar
              </Button>
            </div>
          )}
          <PageHeader title={`Pedido ${order.formattedId}`} description={`Pedido gerado em ${order.formattedDate}`} />
          <div>
            <OrderStatusList order={order} />
          </div>
          <div className={classes.containerGrid2}>
            <div className={classes.section}>
              <OrderShipment order={order} />
            </div>
            <div className={classes.section}>
              <OrderPayment order={order} />
            </div>
            <div className={classes.section}>
              <OrderProductList products={order.products} />
            </div>
          </div>
        </Grid>
      ) : (
        <div className={classes.orderNotFound}>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Não foi possível carregar o pedido. Tente novamente.
          </Typography>
          <Link href="/menu" color="primary">
            Voltar ao menu
          </Link>
        </div>
      )}
    </>
  );
}
