import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { orderStatusName } from './orderStatus';

const useStyles = makeStyles(theme => ({
  historyStatus: {
    borderRadius: '50%',
    display: 'inline-flex',
    width: 30,
    height: 30,
    position: 'relative',
    zIndex: 2,
    '&::after': {
      content: '" "',
      height: 50,
      backgroundColor: '#ccc',
      display: 'block',
      position: 'absolute',
      width: 3,
      top: 30,
      left: 14,
      zIndex: 1,
    },
  },
  o: { backgroundColor: '#ffc107' },
  a: { backgroundColor: '#8BC34A', color: '#fff' },
  d: { backgroundColor: '#007bff', color: '#fff' },
  c: { backgroundColor: '#6c757d', color: '#fff' },
  x: { backgroundColor: '#dc3545', color: '#fff' },
  historyList: {
    marginBottom: 20,
    padding: 0,
  },
  historyListItem: {
    '&:last-child span::after': {
      display: 'none',
    },
  },
  historyContent: {
    padding: '0 10px',
  },
  statusDate: {
    [theme.breakpoints.down('md')]: {
      fontSize: 12,
    },
  },
}));

OrderStatusList.propTypes = {
  order: PropTypes.object.isRequired,
};

export default function OrderStatusList({ order }) {
  const classes = useStyles();
  return (
    <List className={classes.historyList}>
      {order.order_status.map(status => (
        <ListItem key={status.id} className={classes.historyListItem} disableGutters>
          <span className={`${classes.historyStatus} ${classes[status.status]}`} />
          <div className={classes.historyContent}>
            <Typography>{orderStatusName(order.shipment.shipment_method, status.status)}</Typography>
            <Typography variant="body2" color="textSecondary" className={classes.statusDate}>
              {status.formattedDate}
            </Typography>
            {order.deliverers.length > 0 && status.status === 'd' && (
              <>
                {order.deliverers.map(deliverer => (
                  <Typography variant="body2" color="textSecondary" key={deliverer.id}>
                    Entregador {deliverer.name}
                  </Typography>
                ))}
              </>
            )}
          </div>
        </ListItem>
      ))}
    </List>
  );
}
