import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, List, ListItem, Button } from '@material-ui/core';
import PageHeader from 'src/components/pageHeader/PageHeader';
import { formatId } from 'src/helpers/formatOrderId';
import { api } from 'src/services/api';
import Loading from 'src/components/loading/Loading';
import { format, parseISO } from 'date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import { makeStyles } from '@material-ui/core/styles';
import { moneyFormat } from 'src/helpers/numberFormat';
import { orderStatusName } from './orderStatus';
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
import WatchLaterIcon from '@material-ui/icons/WatchLater';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 300,
  },
  section: {
    marginBottom: 15,
    padding: 10,
    border: '1px solid #eee',
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    maxWidth: 900,
    width: '100%',
  },
  o: { backgroundColor: '#ffc107' },
  a: { backgroundColor: '#8BC34A', color: '#fff' },
  d: { backgroundColor: '#007bff', color: '#fff' },
  c: { backgroundColor: '#6c757d', color: '#fff' },
  x: { backgroundColor: '#dc3545', color: '#fff' },
  status: {
    padding: '2px 10px',
    borderRadius: 3,
    margin: '0 0 6px',
    display: 'inline-flex',
  },
  historyStatus: {
    borderRadius: '50%',
    display: 'inline-flex',
    width: 30,
    height: 30,
    '&::after': {
      content: '" "',
      height: 29,
      backgroundColor: '#ccc',
      display: 'block',
      position: 'absolute',
      width: 3,
      bottom: -16,
      left: 14,
    },
  },
  containderGrid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gridGap: 6,
    width: '100%',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  historyList: {
    // borderLeft: `2px solid ${theme.palette.primary.main}`,
    marginBottom: 20,
    padding: 0,
  },
  historyListItem: {
    // paddingBottom: 0,
    // paddingTop: 0,
    '&:last-child span::after': {
      display: 'none',
    },
  },
  statusDate: {
    [theme.breakpoints.down('md')]: {
      fontSize: 12,
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
  total: {
    marginTop: 5,
  },
  totals: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: 6,
    '& p': {
      lineHeight: '15px',
    },
    '& div': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  },
  historyContent: {
    padding: '0 10px',
  },
  scheduleAt: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    '& svg': {
      marginRight: 6,
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
    const socket = io.connect(process.env.URL_NODE_SERVER, { reconnectionAttempts: 5 });
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
  }, []);

  return (
    <>
      <CustomAppbar
        title={order ? `Pedido ${order.formattedId}` : 'Carregando...'}
        actionComponent={<OrderAction hasToken={app.fmHasToken} isSupported={isSupported()} user={!!user.id} />}
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
            <List className={classes.historyList}>
              {order.order_status.map(status => (
                <ListItem key={status.id} className={classes.historyListItem} disableGutters>
                  <span className={`${classes.historyStatus} ${classes[status.status]}`} />
                  <div className={classes.historyContent}>
                    <Typography>{orderStatusName(order.shipment.shipment_method, status.status)}</Typography>
                    <Typography variant="body2" color="textSecondary" className={classes.statusDate}>
                      {status.formattedDate}
                    </Typography>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
          <div className={classes.containderGrid2}>
            <div className={classes.section}>
              <Typography variant="h5" className={classes.title} gutterBottom>
                {order.shipment.shipment_method === 'delivery' ? 'Endereço de entrega' : 'Endereço para retirada'}
              </Typography>
              <Typography>
                {order.shipment.address}, {order.shipment.number}
              </Typography>
              <Typography>{order.shipment.district}</Typography>
              <Typography color="textSecondary">{order.shipment.complement}</Typography>
              <Typography color="textSecondary">
                {order.shipment.city} - {order.shipment.region}
              </Typography>
              {order.shipment.postal_code !== '00000000' && (
                <Typography color="textSecondary">{order.shipment.postal_code}</Typography>
              )}
              {order.shipment.scheduled_at && (
                <Typography variant="body2" className={classes.scheduleAt}>
                  <WatchLaterIcon /> Agendado para às {order.shipment.formattedScheduledAt}
                </Typography>
              )}
            </div>
            <div className={classes.section}>
              <Typography variant="h5" className={classes.title} gutterBottom>
                Forma de pagamento
              </Typography>
              {order.payment_method.kind === 'online_payment' ? (
                <>
                  <Typography>{order.payment_method.method}</Typography>
                </>
              ) : (
                <>
                  <Typography>Pagamento na entrega</Typography>
                  <Typography>
                    {order.payment_method.method}
                    {order.change > 0 && (
                      <Typography
                        color="textSecondary"
                        display="inline"
                        variant="body1"
                      >{`, troco para ${order.formattedChange}`}</Typography>
                    )}
                  </Typography>
                </>
              )}
            </div>
            <div className={classes.section}>
              <Typography variant="h5" className={classes.title} gutterBottom>
                Itens
              </Typography>
              <OrderProductList products={order.products} />
              <div className={classes.totals}>
                <div>
                  <Typography>Subtotal</Typography>
                </div>
                <div>
                  <Typography>{order.formattedSubtotal}</Typography>
                </div>
                <div>
                  <Typography>Desconto</Typography>
                </div>
                <div>
                  <Typography>{order.formattedDiscount}</Typography>
                </div>
                <div>
                  <Typography>Taxa de entrega</Typography>
                </div>
                <div>
                  <Typography>{order.formattedTax}</Typography>
                </div>
                <div className={classes.total}>
                  <Typography>Total</Typography>
                </div>
                <div className={classes.total}>
                  <Typography variant="h5">
                    <strong>{order.formattedTotal}</strong>
                  </Typography>
                </div>
              </div>
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
