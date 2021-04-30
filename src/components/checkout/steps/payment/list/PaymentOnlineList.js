import React, { useState } from 'react';
import { List, ListItem, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import SmartphoneIcon from '@material-ui/icons/Smartphone';
import { makeStyles, fade } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setPaymentMethod } from 'src/store/redux/modules/order/actions';
import PaymentMercadoPago from '../card/PaymentMercadoPago';
import PaymentCpf from '../PaymentCpf';
import PaymentCard from '../card/PaymentCard';
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
    borderRadius: 4,
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
  },
  selected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 15,
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

PaymentOnlineList.propTypes = {
  paymentMethods: PropTypes.array.isRequired,
  paymentMethodId: PropTypes.number,
};

export default function PaymentOnlineList({ paymentMethods, paymentMethodId }) {
  const classes = useStyles();
  const checkout = useCheckout();
  const [dialogCpf, setDialogCpf] = useState(false);
  const [dialogCard, setDialogCard] = useState(false);
  const user = useSelector(state => state.user);
  const order = useSelector(state => state.order);
  const dispatch = useDispatch();
  const restaurant = useSelector(state => state.restaurant);

  function handleClick(paymentMethod) {
    dispatch(setPaymentMethod(paymentMethod));

    if (paymentMethod.kind === 'picpay' || paymentMethod.kind === 'pix') {
      if (!user.customer.cpf) {
        setDialogCpf(true);
        return;
      }
    } else if (paymentMethod.kind === 'card') {
      setDialogCard(true);
      return;
    }

    checkout.handleSetStepById('STEP_CONFIRM');
  }

  function handleCloseDialogCpf() {
    setDialogCpf(false);
    if (user.customer.cpf) checkout.handleSetStepById('STEP_CONFIRM');
    else {
      dispatch(setPaymentMethod(null));
    }
  }

  function handleCloseDialogCard() {
    setDialogCard(false);
    if (!checkout.isCardValid) dispatch(setPaymentMethod(null));
  }

  return (
    <>
      {dialogCpf && <PaymentCpf onExited={handleCloseDialogCpf} />}
      {dialogCard &&
        (restaurant.payment_gateway === 'mercadopago' ? (
          <PaymentMercadoPago onExited={handleCloseDialogCard} />
        ) : (
          <PaymentCard onExited={handleCloseDialogCard} />
        ))}
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
                    {paymentMethod.kind === 'card' && <CreditCardIcon color="action" />}
                    {paymentMethod.kind === 'picpay' && <SmartphoneIcon color="action" />}
                    {paymentMethod.kind === 'pix' && <SmartphoneIcon color="action" />}
                  </div>
                </div>
                <div className={classes.method}>
                  <Typography>{paymentMethod.method}</Typography>
                  {paymentMethod.kind === 'card' && checkout.isCardValid && (
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
