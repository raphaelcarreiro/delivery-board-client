import React, { useState } from 'react';
import { Typography, Button, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import DialogInput, { DialogInputConsumer } from 'src/components/dialog/DialogInput';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { setChange } from 'src/store/redux/modules/order/actions';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: 250,
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      height: 200,
    },
  },
  total: {
    fontWeight: 500,
  },
  btnConfirm: {
    marginTop: 30,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
}));

PaymentChange.propTypes = {
  onExited: PropTypes.func.isRequired,
};

export default function PaymentChange({ onExited }) {
  const [hasChange, setHasChange] = useState(false);
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const [paymentChange, setPaymentChange] = useState('');
  const classes = useStyles();

  function handleChangeYes() {
    setHasChange(true);
  }

  function handleChangeNo() {
    setHasChange(false);
    dispatch(setChange(0));
  }

  function handleSubmit(event, handleCloseDialog) {
    event.preventDefault();
    dispatch(setChange(paymentChange));
    handleCloseDialog();
  }

  return (
    <DialogInput onExited={onExited} maxWidth="xs">
      <DialogInputConsumer>
        {({ handleCloseDialog }) => (
          <>
            {!hasChange ? (
              <div className={classes.container}>
                <Typography variant="h6">Precisa de troco?</Typography>
                <div className={classes.actions}>
                  <Button onClick={handleChangeYes} variant="contained" color="primary">
                    Sim
                  </Button>
                  <Button
                    onClick={() => {
                      handleChangeNo();
                      handleCloseDialog();
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Não
                  </Button>
                </div>
              </div>
            ) : (
              <div className={classes.container}>
                <form onSubmit={event => handleSubmit(event, handleCloseDialog)} className={classes.form}>
                  <Typography>
                    Troco para quanto? Seu pedido deu
                    <span className={classes.total}>{' ' + cart.formattedTotal}</span>
                  </Typography>
                  <TextField
                    label="Dinheiro R$"
                    placeholder="Digite o valor que você vair pagar ao entregador"
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    autoFocus
                    value={paymentChange}
                    onChange={event => setPaymentChange(event.target.value)}
                    type="number"
                  />
                  <Button
                    type="submit"
                    disabled={paymentChange <= cart.total}
                    className={classes.btnConfirm}
                    color="primary"
                    variant="contained"
                    fullWidth
                  >
                    Confirmar
                  </Button>
                </form>
              </div>
            )}
          </>
        )}
      </DialogInputConsumer>
    </DialogInput>
  );
}
