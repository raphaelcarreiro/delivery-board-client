import React, { useState } from 'react';
import { List, ListItem, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { makeStyles, fade } from '@material-ui/core/styles';
import PaymentCpf from '../PaymentCpf';
import { useSelector } from 'src/store/redux/selector';
import PicPayIcon from 'src/components/icons/PicPayIcon';
import { useCheckout } from '../../hooks/useCheckout';

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

interface PaymentOtherListProps {
  paymentMethods: Array<any>;
  handleSetPaymentMethod(paymentMethod: any): void;
  paymentMethodId: number;
}

const PaymentOtherList: React.FC<PaymentOtherListProps> = ({
  paymentMethods,
  handleSetPaymentMethod,
  paymentMethodId,
}) => {
  const classes = useStyles();
  const checkout = useCheckout();
  const [dialogCpf, setDialogCpf] = useState(false);
  const user = useSelector(state => state.user);

  function handleClick(paymentMethod) {
    handleSetPaymentMethod(paymentMethod);

    if (paymentMethod.kind === 'picpay') {
      if (!user.customer.cpf) {
        setDialogCpf(true);
        return;
      }
    }

    checkout.handleStepNext();
  }

  function handleCloseDialogCpf() {
    setDialogCpf(false);
    if (user.customer.cpf) checkout.handleStepNext();
    else {
      handleSetPaymentMethod(null);
    }
  }

  return (
    <>
      {dialogCpf && <PaymentCpf onExited={handleCloseDialogCpf} />}
      <List className={classes.list}>
        {paymentMethods.map(
          paymentMethod =>
            paymentMethod.kind === 'picpay' && (
              <ListItem
                onClick={() => handleClick(paymentMethod)}
                button
                className={paymentMethod.id === paymentMethodId ? classes.selected : classes.listItem}
                key={paymentMethod.id}
              >
                <div className={classes.iconContainer}>
                  <div className={classes.icon}>
                    <PicPayIcon />
                  </div>
                </div>
                <div className={classes.method}>
                  <Typography>{paymentMethod.method}</Typography>
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
};

export default PaymentOtherList;
