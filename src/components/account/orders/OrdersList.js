import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, Typography } from '@material-ui/core';
import { parseISO, formatDistanceStrict } from 'date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import PropTypes from 'prop-types';
import Link from 'src/components/link/Link';

const useStyles = makeStyles(theme => ({
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: 6,
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    boxShadow: '0 0 3px 1px #eee',
    borderRadius: theme.shape.borderRadius,
  },
  status: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '4px 10px',
    borderRadius: theme.shape.borderRadius,
    fontSize: 12,
  },

  dateDistance: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  address: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: 250,
    },
  },
  customerName: {
    marginTop: 10,
  },
  total: {
    marginTop: 10,
  },
  p: { backgroundColor: '#17a2b8', color: '#fff' },
  o: { backgroundColor: '#ffc107' },
  a: { backgroundColor: '#8BC34A', color: '#fff' },
  d: { backgroundColor: '#007bff', color: '#fff' },
  c: { backgroundColor: '#6c757d', color: '#fff' },
  x: { backgroundColor: '#dc3545', color: '#fff' },
  scheduledAt: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function OrdersList({ orders }) {
  const classes = useStyles();
  const [formattedOrders, setFormattedOrders] = useState([]);

  useEffect(() => {
    setFormattedOrders(orders);

    const timer = setInterval(() => {
      setFormattedOrders(
        orders.map(order => {
          order.dateDistance = formatDistanceStrict(parseISO(order.created_at), new Date(), {
            locale: ptbr,
            roundingMethod: 'ceil',
          });
          return order;
        })
      );
    }, 60000);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line
  }, [orders]);

  return (
    <List className={classes.list} disablePadding>
      {formattedOrders.map(order => {
        return (
          <ListItem
            key={order.id}
            className={classes.listItem}
            button
            href={'/account/orders/[id]'}
            as={`/account/orders/${order.uuid}`}
            component={Link}
          >
            <span className={`${classes.status} ${classes[order.status]}`}>{order.statusName}</span>
            <Typography variant="body1" color="primary">
              pedido {order.formattedId}
            </Typography>
            <Typography className={classes.customerName}>{order.customer.name}</Typography>
            <div>
              <Typography variant="body2" color="textSecondary" display="inline">
                {order.formattedDate}
              </Typography>
              {(order.status === 'o' || order.status === 'a') && (
                <Typography variant="body2" display="inline">
                  {`, ${order.dateDistance} atrás`}
                </Typography>
              )}
            </div>
            {order.shipment.shipment_method === 'customer_collect' ? (
              <Typography variant="body2" color="textSecondary">
                Cliente retira
                {order.shipment.scheduled_at && (
                  <Typography variant="body2" color="textPrimary" component="span" display="inline">
                    {`, agendado para as ${order.shipment.formattedScheduledAt}`}
                  </Typography>
                )}
              </Typography>
            ) : (
              <Typography className={classes.address} variant="body2" color="textSecondary">
                {order.shipment.address}, {order.shipment.number}, {order.shipment.district}
              </Typography>
            )}
            <Typography className={classes.total} variant="h6">
              {order.formattedTotal}
            </Typography>
          </ListItem>
        );
      })}
    </List>
  );
}

OrdersList.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default OrdersList;
