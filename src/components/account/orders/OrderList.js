import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, Typography, IconButton } from '@material-ui/core';
import { orderStatus } from './orderStatus';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: 4,
  },
  status: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
  },
  icon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
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
  o: { backgroundColor: '#ffc107' },
  a: { backgroundColor: '#8BC34A', color: '#fff' },
  d: { backgroundColor: '#007bff', color: '#fff' },
  c: { backgroundColor: '#6c757d', color: '#fff' },
  x: { backgroundColor: '#dc3545', color: '#fff' },
}));

function OrderList({ orders }) {
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
            as={`/account/orders/${order.encrypted_id}`}
            component={Link}
          >
            <span className={`${classes.status} ${classes[order.status]}`}>{orderStatus[order.status]}</span>
            <Typography variant="body2" color="primary">
              Pedido {order.formattedId}
            </Typography>
            <Typography className={classes.customerName}>{order.customer.name}</Typography>
            <div>
              <Typography variant="body2" color="textSecondary" display="inline">
                {order.formattedDate}
              </Typography>
              {(order.status === 'o' || order.status === 'a') && (
                <Typography variant="body2" color="secondary" display="inline">
                  {`, ${order.dateDistance} atrás`}
                </Typography>
              )}
            </div>
            <Typography className={classes.address} variant="body2" color="textSecondary">
              {order.address}, {order.address_number}, {order.district}
            </Typography>
            <Typography className={classes.total} variant="h6" color="secondary">
              {order.formattedTotal}
            </Typography>
            <IconButton className={classes.icon}>
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        );
      })}
    </List>
  );
}

OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default OrderList;
