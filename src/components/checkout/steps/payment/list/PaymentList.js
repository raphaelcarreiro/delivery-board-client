import React, { useState } from 'react';
import { List, ListItem, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { makeStyles, fade } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import PaymentChange from 'src/components/checkout/steps/payment/PaymentChange';
import { useSelector, useDispatch } from 'react-redux';
import { moneyFormat } from 'src/helpers/numberFormat';
import { setPaymentMethod } from 'src/store/redux/modules/order/actions';
import { useCheckout } from '../../../hooks/useCheckout';

const useStyles = makeStyles(theme => ({
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gridGap: 6,
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 15,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
  },
  selected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 15,
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.primary.main, 0.2),
    position: 'relative',
    '&:focus': {
      backgroundColor: fade(theme.palette.primary.main, 0.2),
    },
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.25),
    },
  },
  checkIcon: {
    position: 'absolute',
    right: 10,
    backgroundColor: '#fff',
    borderRadius: '50%',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    borderRadius: '50%',
    border: `1px solid rgba(0, 0, 0, 0.54)`,
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  method: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

PaymentList.propTypes = {
  paymentMethods: PropTypes.array.isRequired,
  paymentMethodId: PropTypes.number,
};

export default function PaymentList({ paymentMethods, paymentMethodId }) {
  const classes = useStyles();
  const checkout = useCheckout();
  const [dialogChange, setDialogChange] = useState(false);
  const order = useSelector(state => state.order);
  const dispatch = useDispatch();

  function handleClick(paymentMethod) {
    dispatch(setPaymentMethod(paymentMethod));

    if (paymentMethod.kind === 'money') {
      setDialogChange(true);
      return;
    }

    checkout.handleSetStepById('STEP_CONFIRM');
  }

  function handleCloseDialog() {
    setDialogChange(false);
    checkout.handleSetStepById('STEP_CONFIRM');
  }

  return (
    <>
      {dialogChange && <PaymentChange onExited={handleCloseDialog} />}
      <List className={classes.list}>
        {paymentMethods.map(
          paymentMethod =>
            paymentMethod.mode === 'offline' && (
              <ListItem
                onClick={() => handleClick(paymentMethod)}
                button
                className={paymentMethod.id === paymentMethodId ? classes.selected : classes.listItem}
                key={paymentMethod.id}
              >
                <div className={classes.iconContainer}>
                  <div className={classes.icon}>
                    {paymentMethod.kind === 'card' && <CreditCardIcon color="action" />}
                    {paymentMethod.kind === 'money' && <AttachMoneyIcon color="action" />}
                  </div>
                </div>
                <div className={classes.method}>
                  <Typography>{paymentMethod.method}</Typography>
                  {order.paymentMethod && (
                    <>
                      {order.change > 0 && paymentMethod.kind === 'money' && (
                        <Typography color="textSecondary">Troco para {moneyFormat(order.change)}</Typography>
                      )}
                    </>
                  )}
                </div>
                {paymentMethod.id === paymentMethodId && (
                  <CheckCircleIcon color="primary" className={classes.checkIcon} />
                )}
              </ListItem>
            )
        )}
      </List>
    </>
  );
}
