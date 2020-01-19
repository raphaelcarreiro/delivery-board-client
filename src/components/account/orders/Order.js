import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, List, ListItem } from '@material-ui/core';
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

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 400,
  },
  section: {
    marginBottom: 15,
    padding: 10,
    border: '1px solid #ddd',
    borderRadius: 4,
    backgroundColor: '#eee',
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
    padding: '2px 10px',
    borderRadius: 3,
    display: 'inline-flex',
    minWidth: 150,
    marginRight: 15,
    fontSize: 16,
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
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridGap: 6,
    width: '100%',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  historyList: {
    borderLeft: `2px solid ${theme.palette.primary.main}`,
    marginBottom: 20,
    padding: 0,
  },
  historyListItem: {
    // paddingBottom: 0,
    // paddingTop: 0,
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
}));

Order.propTypes = {
  cryptId: PropTypes.string.isRequired,
};

export default function Order({ cryptId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const messaging = useContext(MessagingContext);
  const classes = useStyles();

  useEffect(() => {
    const socket = io.connect(process.env.URL_NODE_SERVER);
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
          formattedTotal: moneyFormat(response.data.total),
          products: response.data.products.map(product => {
            product.formattedFinalPrice = moneyFormat(product.final_price);
            return product;
          }),
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
      {loading ? (
        <Loading />
      ) : order ? (
        <Grid container>
          <CustomAppbar title={`Pedido ${order.formattedId}`} />
          <PageHeader title={`Pedido ${order.formattedId}`} description={`Pedido gerado em ${order.formattedDate}`} />
          <div>
            <List className={classes.historyList}>
              {order.order_status.map(status => (
                <ListItem key={status.id} className={classes.historyListItem}>
                  <span className={`${classes.historyStatus} ${classes[status.status]}`}>
                    {orderStatus[status.status]}
                  </span>
                  <Typography variant="body1" color="textSecondary" className={classes.statusDate}>
                    em {status.formattedDate}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </div>
          <div className={classes.containderGrid2}>
            <div className={classes.section}>
              <Typography variant="h5" className={classes.title}>
                Endereço de entrega
              </Typography>
              <Typography>
                {order.address}, {order.address_number}
              </Typography>
              <Typography>{order.district}</Typography>
              <Typography>{order.address_complement}</Typography>
              <Typography>{order.address_postal_code}</Typography>
            </div>
            <div className={classes.section}>
              <Typography variant="h5" className={classes.title}>
                Forma de pagamento
              </Typography>
              <Typography>{order.payment_method.method}</Typography>
              {order.change > 0 && (
                <Typography>
                  {`Troco para ${order.formattedChange}`} ({moneyFormat(order.change - order.total)})
                </Typography>
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
                    <Typography variant="h6" color="textSecondary">
                      {product.formattedFinalPrice}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Typography variant="h5" align="right">
                <strong>{order.formattedTotal}</strong>
              </Typography>
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
