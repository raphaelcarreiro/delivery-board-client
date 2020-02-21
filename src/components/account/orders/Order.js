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
import { orderStatus } from './orderStatus';
import CustomAppbar from 'src/components/appbar/CustomAppbar';
import io from 'socket.io-client';
import { MessagingContext } from 'src/components/messaging/Messaging';
import { useSelector } from 'react-redux';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { AppContext } from 'src/App';
import { firebaseMessagingIsSupported as isSupported } from 'src/config/FirebaseConfig';
import OrderAction from './OrderAction';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 400,
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
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 3,
    borderBottom: '1px dashed #ddd',
  },
  list: {
    paddingTop: 0,
    paddingBottom: 20,
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
  totalsLabel: {
    display: 'inline-block',
    width: 100,
    textAlign: 'left',
  },
  totals: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: 6,
    '& p, h5': {
      textAlign: 'right',
    },
  },
  historyContent: {
    padding: '0 10px',
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
  const restaurant = useSelector(state => state.restaurant);
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
        const formattedId = formatId(response.data.id);
        document.title = `Pedido ${formattedId}`;

        const date = parseISO(response.data.created_at);

        setOrder({
          ...response.data,
          formattedId,
          formattedDate: format(date, "PP 'às' p", { locale: ptbr }),
          formattedChange: moneyFormat(response.data.change),
          products: response.data.products.map(product => {
            product.formattedFinalPrice = moneyFormat(product.final_price);
            return product;
          }),
          formattedSubtotal: moneyFormat(response.data.subtotal),
          formattedDiscount: moneyFormat(response.data.discount),
          formattedTotal: moneyFormat(response.data.total),
          order_status: response.data.order_status.reverse().map(status => {
            const statusDate = parseISO(status.created_at);
            status.formattedDate = format(statusDate, "PP 'às' p", { locale: ptbr });
            return status;
          }),
        });
      })
      .catch(() => {
        messaging.handleOpen('Pedido não encontrado');
        document.title = 'Pedido não encontrado!';
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
                    <Typography>{orderStatus[status.status]}</Typography>
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
              <Typography variant="h5" className={classes.title}>
                {order.shipment.shipment_method === 'delivery' ? 'Endereço de entrega' : 'Cliente retira'}
              </Typography>
              <Typography>
                {order.shipment.address}, {order.shipment.number}
              </Typography>
              <Typography>{order.shipment.district}</Typography>
              <Typography>{order.shipment.complement}</Typography>
              <Typography>
                {order.shipment.city} - {order.shipment.region}
              </Typography>
              {order.shipment.postal_code !== '00000000' && <Typography>{order.shipment.postal_code}</Typography>}
            </div>
            <div className={classes.section}>
              <Typography variant="h5" className={classes.title}>
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
              <Typography variant="h5" className={classes.title}>
                Itens
              </Typography>
              <List className={classes.list}>
                {order.products.map(product => (
                  <ListItem key={product.id} className={classes.listItem}>
                    <div>
                      <Typography variant="subtitle1">
                        {product.amount}x {product.name}
                      </Typography>
                    </div>
                    <Typography variant="h6">{product.formattedFinalPrice}</Typography>
                  </ListItem>
                ))}
              </List>
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
                  <Typography>Total</Typography>
                </div>
                <Typography variant="h5">
                  <strong>{order.formattedTotal}</strong>
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
      ) : (
        <div className={classes.orderNotFound}>
          <Typography variant="h6" color="error">
            Pedido não encontrado!
          </Typography>
        </div>
      )}
    </>
  );
}
