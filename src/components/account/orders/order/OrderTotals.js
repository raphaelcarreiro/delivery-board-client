import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
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
  total: {
    marginTop: 5,
  },
});

OrderTotals.propTypes = {
  order: PropTypes.object.isRequired,
};

export default function OrderTotals({ order }) {
  const classes = useStyles();

  return (
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
  );
}
