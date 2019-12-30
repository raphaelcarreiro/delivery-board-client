import React, { useContext, useState } from 'react';
import { List, ListItem } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { makeStyles, fade } from '@material-ui/core/styles';
import { CheckoutContext } from 'src/components/checkout/Checkout';
import PropTypes from 'prop-types';
import CustomDialog from 'src/components/dialog/CustomDialog';
import PaymentChange from 'src/components/checkout/steps/payment/PaymentChange';
import { useDispatch } from 'react-redux';
import { setChange } from 'src/store/redux/modules/order/actions';

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
}));

PaymentList.propTypes = {
  paymentMethods: PropTypes.array.isRequired,
  handleSetPaymentMethod: PropTypes.func.isRequired,
  paymentMethodId: PropTypes.number.isRequired,
};

export default function PaymentList({ paymentMethods, handleSetPaymentMethod, paymentMethodId }) {
  const classes = useStyles();
  const checkout = useContext(CheckoutContext);
  const [dialogChange, setDialogChange] = useState(false);
  const dispatch = useDispatch();

  function handleClick(paymentMethod) {
    handleSetPaymentMethod(paymentMethod);
    if (paymentMethod.kind === 'money') {
      setDialogChange(true);
      return;
    } else dispatch(setChange(0));

    checkout.handleStepNext();
  }

  function handleCloseDialog() {
    setDialogChange(false);
    checkout.handleStepNext();
  }

  return (
    <>
      {dialogChange && <PaymentChange onExited={handleCloseDialog} />}
      <List className={classes.list}>
        {paymentMethods.map(paymentMethod => (
          <ListItem
            onClick={() => handleClick(paymentMethod)}
            button
            className={paymentMethod.id === paymentMethodId ? classes.selected : classes.listItem}
            key={paymentMethod.id}
          >
            <div className={classes.iconContainer}>
              <div className={classes.icon}>
                {paymentMethod.kind === 'paymentCard' && <CreditCardIcon color="primary" />}
                {paymentMethod.kind === 'money' && <AttachMoneyIcon color="primary" />}
              </div>
            </div>
            <div>{paymentMethod.method}</div>
            {paymentMethod.id === paymentMethodId && <CheckCircleIcon color="primary" className={classes.checkIcon} />}
          </ListItem>
        ))}
      </List>
    </>
  );
}
