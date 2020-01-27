import React, { useContext } from 'react';
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

  function handleChange(index, value) {
    dispatch(changeCreditCard(index, value));
  }

  return (
    <Grid container className={classes.container}>
      <Grid item xl={4} lg={4} md={6} xs={12}>
        <TextField
          error={!!checkout.cardValidation.card_number}
          helperText={checkout.cardValidation.card_number}
          label="Número do cartão"
          margin="normal"
          placeholder="Número do cartão"
          value={order.creditCard.card_number}
          onChange={e => handleChange('card_number', e.target.value)}
          fullWidth
          autoFocus
          autoComplete="cc-number"
          InputProps={{
            inputComponent: CardNumber,
          }}
        />
        <TextField
          label="Nome e sobrenome"
          error={!!checkout.cardValidation.card_holder_name}
          helperText={
            checkout.cardValidation.card_holder_name
              ? checkout.cardValidation.card_holder_name
              : 'Assim como está escrito no cartão'
          }
          margin="normal"
          placeholder="Nome e sobrenome"
          value={order.creditCard.card_holder_name}
          onChange={e => handleChange('card_holder_name', e.target.value)}
          fullWidth
          autoComplete="cc-name"
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              error={!!checkout.cardValidation.card_expiration_date}
              helperText={
                checkout.cardValidation.card_expiration_date ? checkout.cardValidation.card_expiration_date : 'MM/AA'
              }
              label="Data de vencimento"
              margin="normal"
              placeholder="Data de vencimento do cartão"
              value={order.creditCard.card_expiration_date}
              onChange={e => handleChange('card_expiration_date', e.target.value)}
              fullWidth
              autoComplete="cc-exp"
              InputProps={{
                inputComponent: CardExpirationDate,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Código de segurança"
              error={!!checkout.cardValidation.card_cvv}
              helperText={
                checkout.cardValidation.card_cvv
                  ? checkout.cardValidation.card_cvv
                  : 'Últimos três número do verso do seu cartão'
              }
              margin="normal"
              placeholder="Código de segurança"
              value={order.creditCard.card_cvv}
              onChange={e => handleChange('card_cvv', e.target.value)}
              autoComplete="cc-csc"
              fullWidth
              InputProps={{
                inputComponent: CardSecurityCode,
              }}
            />
          </Grid>
        </Grid>
        <TextField
          error={!!checkout.cardValidation.card_owner_cpf}
          helperText={checkout.cardValidation.card_owner_cpf}
          label="CPF do titular do cartão"
          margin="normal"
          placeholder="CPF do titular do cartão"
          value={order.creditCard.card_owner_cpf}
          onChange={e => handleChange('card_owner_cpf', e.target.value)}
          fullWidth
          InputProps={{
            inputComponent: CpfInput,
          }}
        />
      </Grid>
    </Grid>
  );
}
