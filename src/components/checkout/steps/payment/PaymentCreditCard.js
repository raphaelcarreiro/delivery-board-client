import React, { useContext, useRef, useEffect } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { changeCreditCard } from 'src/store/redux/modules/order/actions';
import CardSecurityCode from 'src/components/masked-input/CardSecurityCode';
import CardExpirationDate from 'src/components/masked-input/CardExperitionDate';
import CpfInput from 'src/components/masked-input/CpfInput';
import CardNumber from 'src/components/masked-input/CardNumber';
import { CheckoutContext } from '../../Checkout';

const useStyles = makeStyles({
  container: {
    display: 'flex',
  },
});

export default function PaymentCreditCard() {
  const classes = useStyles();
  const order = useSelector(state => state.order);
  const dispatch = useDispatch();
  const checkout = useContext(CheckoutContext);

  const inputs = {
    number: useRef(),
    name: useRef(),
    expiration_date: useRef(),
    cvv: useRef(),
    cpf: useRef(),
  };

  useEffect(() => {
    if (checkout.cardValidation.number) inputs.number.focus();
    else if (checkout.cardValidation.name) inputs.name.focus();
    else if (checkout.cardValidation.expiration_date) inputs.expiration_date.focus();
    else if (checkout.cardValidation.cvv) inputs.cvv.focus();
    else if (checkout.cardValidation.cpf) inputs.cpf.focus();
  }, [checkout.cardValidation]);

  function handleChange(index, value) {
    dispatch(changeCreditCard(index, value));
  }

  return (
    <Grid container className={classes.container}>
      <Grid item xl={4} lg={4} md={6} xs={12}>
        <TextField
          inputRef={ref => (inputs.number = ref)}
          error={!!checkout.cardValidation.number}
          helperText={checkout.cardValidation.number}
          label="Número do cartão"
          margin="normal"
          placeholder="Número do cartão"
          value={order.creditCard.number}
          onChange={e => handleChange('number', e.target.value)}
          fullWidth
          autoFocus
          autoComplete="cc-number"
          InputProps={{
            inputComponent: CardNumber,
          }}
        />
        <TextField
          inputRef={ref => (inputs.name = ref)}
          label="Nome e sobrenome"
          error={!!checkout.cardValidation.name}
          helperText={checkout.cardValidation.name ? checkout.cardValidation.name : 'Assim como está escrito no cartão'}
          margin="normal"
          placeholder="Nome e sobrenome"
          value={order.creditCard.name}
          onChange={e => handleChange('name', e.target.value)}
          fullWidth
          autoComplete="cc-name"
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              inputRef={ref => (inputs.expiration_date = ref)}
              error={!!checkout.cardValidation.expiration_date}
              helperText={checkout.cardValidation.expiration_date ? checkout.cardValidation.expiration_date : 'MM/AA'}
              label="Vencimento"
              margin="normal"
              placeholder="Vencimento do cartão"
              value={order.creditCard.expiration_date}
              onChange={e => handleChange('expiration_date', e.target.value)}
              fullWidth
              autoComplete="cc-exp"
              InputProps={{
                inputComponent: CardExpirationDate,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              inputRef={ref => (inputs.cvv = ref)}
              label="Código"
              error={!!checkout.cardValidation.cvv}
              helperText={
                checkout.cardValidation.cvv ? checkout.cardValidation.cvv : 'Últimos três número do verso do seu cartão'
              }
              margin="normal"
              placeholder="Código de segurança"
              value={order.creditCard.cvv}
              onChange={e => handleChange('cvv', e.target.value)}
              autoComplete="cc-csc"
              fullWidth
              InputProps={{
                inputComponent: CardSecurityCode,
              }}
            />
          </Grid>
        </Grid>
        <TextField
          inputRef={ref => (inputs.cpf = ref)}
          error={!!checkout.cardValidation.cpf}
          helperText={checkout.cardValidation.cpf}
          label="CPF do titular do cartão"
          margin="normal"
          placeholder="CPF do titular do cartão"
          value={order.creditCard.cpf}
          onChange={e => handleChange('cpf', e.target.value)}
          fullWidth
          InputProps={{
            inputComponent: CpfInput,
          }}
        />
      </Grid>
    </Grid>
  );
}
