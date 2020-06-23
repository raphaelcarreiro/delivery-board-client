import React, { useContext, useState } from 'react';
import { List, ListItem, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { makeStyles, fade } from '@material-ui/core/styles';
import { CheckoutContext } from 'src/components/checkout/Checkout';
import PropTypes from 'prop-types';
import PaymentChange from 'src/components/checkout/steps/payment/PaymentChange';
import { useSelector, useDispatch } from 'react-redux';
import { moneyFormat } from 'src/helpers/numberFormat';
import PaymentCpf from './PaymentCpf';
import PaymentCreditCard from './PaymentCard';
import { setPaymentMethod } from 'src/store/redux/modules/order/actions';

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
  },
  selected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: 4,
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
    border: `1px solid ${theme.palette.primary.light}`,
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
  const checkout = useContext(CheckoutContext);
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
                    {paymentMethod.kind === 'card' && <CreditCardIcon color="primary" />}
                    {paymentMethod.kind === 'money' && <AttachMoneyIcon color="primary" />}
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
