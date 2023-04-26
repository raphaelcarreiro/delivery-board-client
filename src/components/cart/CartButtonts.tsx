import React, { FC, Dispatch, SetStateAction } from 'react';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useApp } from 'src/providers/AppProvider';
import { useSelector } from 'src/store/redux/selector';
import { useCart } from './hooks/useCart';

const styles = makeStyles(theme => ({
  action: {
    marginTop: 20,
    '& button': {
      marginBottom: 10,
    },
  },
  buying: {
    display: 'block',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
  warning: {
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: theme.palette.warning.light,
    padding: 10,
    fontWeight: 'bold',
  },
}));

interface CartButtonsProps {
  setDialogClosedRestaurant: Dispatch<SetStateAction<boolean>>;
}

const CartButtons: FC<CartButtonsProps> = ({ setDialogClosedRestaurant }) => {
  const router = useRouter();
  const classes = styles();
  const { handleCartVisibility } = useApp();
  const restaurant = useSelector(state => state.restaurant);
  const movement = useSelector(state => state.boardMovement);
  const { setShowCustomerDialog, handleSubmit, saving } = useCart();

  function handleBuyingClick() {
    handleCartVisibility(false);
  }

  function handleCheckoutClick() {
    if (!movement?.customer) {
      setShowCustomerDialog(true);
      return;
    }

    if (!restaurant?.is_kitchen_open) {
      setDialogClosedRestaurant(true);
      return;
    }

    handleSubmit();
  }

  return (
    <div className={classes.action}>
      {movement?.is_open && (
        <Button
          disabled={saving}
          size="large"
          onClick={handleCheckoutClick}
          variant="contained"
          color="primary"
          fullWidth
        >
          enviar pedido
        </Button>
      )}

      {!movement?.is_open && (
        <div className={classes.warning}>
          <Typography variant="h6">Esta conta foi fechada. Não é possível enviar pedidos</Typography>
        </div>
      )}

      {!movement && (
        <div className={classes.warning}>
          <Typography variant="h6">Você precisa escanear o código QR disponível na mesa para enviar pedido</Typography>
        </div>
      )}

      <Button
        variant="text"
        color="primary"
        size="large"
        fullWidth
        className={classes.buying}
        onClick={() => {
          router.route === '/cart' ? router.push('/menu') : handleBuyingClick();
        }}
      >
        VOLTAR AO CARDÁPIO
      </Button>
    </div>
  );
};

export default CartButtons;
