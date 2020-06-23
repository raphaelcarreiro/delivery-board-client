import React, { useContext, useState } from 'react';
import { List, ListItem, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import SmartphoneIcon from '@material-ui/icons/Smartphone';
import { makeStyles, fade } from '@material-ui/core/styles';
import { CheckoutContext } from 'src/components/checkout/Checkout';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
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

PaymentOnlineList.propTypes = {
  paymentMethods: PropTypes.array.isRequired,
  handleSetPaymentMethod: PropTypes.func.isRequired,
  paymentMethodId: PropTypes.number,
};

export default function PaymentOnlineList({ paymentMethods, paymentMethodId }) {
  const classes = useStyles();
  const checkout = useContext(CheckoutContext);
  const [dialogCpf, setDialogCpf] = useState(false);
  const [dialogCard, setDialogCard] = useState(false);
  const user = useSelector(state => state.user);
  const order = useSelector(state => state.order);
  const dispatch = useDispatch();

  function handleClick(paymentMethod) {
    dispatch(setPaymentMethod(paymentMethod));

    if (paymentMethod.kind === 'picpay') {
      if (!user.customer.cpf) {
        setDialogCpf(true);
        return;
      }
    } else if (paymentMethod.kind === 'card') {
      setDialogCard(true);
      return;
    }

    checkout.handleStepNext();
  }

  function handleCloseDialogCpf() {
    setDialogCpf(false);
    if (user.customer.cpf) checkout.handleStepNext();
    else {
      dispatch(setPaymentMethod(null));
    }
  }

  function handleCloseDialogCard() {
    setDialogCard(false);
    if (!checkout.cardValidation.approved) dispatch(setPaymentMethod(paymentMethods[0]));
  }

  return (
    <>
      {dialogCpf && <PaymentCpf onExited={handleCloseDialogCpf} />}
      {dialogCard && <PaymentCreditCard onExited={handleCloseDialogCard} />}
      <List className={classes.list}>
        {paymentMethods.map(
          paymentMethod =>
            paymentMethod.mode === 'online' && (
              <ListItem
                onClick={() => handleClick(paymentMethod)}
                button
                className={paymentMethod.id === paymentMethodId ? classes.selected : classes.listItem}
                key={paymentMethod.id}
              >
                <div className={classes.iconContainer}>
                  <div className={classes.icon}>
                    {paymentMethod.kind === 'card' ? (
                      <CreditCardIcon color="primary" />
                    ) : (
                      paymentMethod.kind === 'picpay' && <SmartphoneIcon color="primary" />
                    )}
                  </div>
                </div>
                <div className={classes.method}>
                  <Typography>{paymentMethod.method}</Typography>
                  {paymentMethod.kind === 'card' && checkout.cardValidation.approved && (
                    <Typography>**** **** **** {order.creditCard.number.substr(-4)}</Typography>
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
