import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { changeCreditCard } from 'src/store/redux/modules/order/actions';

const useStyles = makeStyles({
  container: {
    display: 'flex',
  },
});

export default function PaymentCreditCard() {
  const classes = useStyles();
  const order = useSelector(state => state.order);
  const dispatch = useDispatch();

  function handleChange(index, value) {
    dispatch(changeCreditCard(index, value));
  }

  return (
    <Grid container className={classes.container}>
      <Grid item xs={4}>
        <TextField
          label="Número do cartão"
          margin="normal"
          placeholder="Digite o número do cartão de crédito"
          value={order.creditCard.number}
          onChange={e => handleChange('card_number', e.target.value)}
          fullWidth
          autoFocus
        />
        <TextField
          label="Nome e sobrenome"
          helperText="Assim como está escrito no cartão"
          margin="normal"
          placeholder="Número do cartão"
          value={order.creditCard.card_holder_name}
          onChange={e => handleChange('card_holder_name', e.target.value)}
          fullWidth
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Data de vencimento"
              helperText="MM/AA"
              margin="normal"
              placeholder="Data de vencimento do cartão"
              value={order.creditCard.card_expiration_date}
              onChange={e => handleChange('card_expiration_date', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Código de segurança"
              helperText="Ultimos três numeros do verso do seu cartão"
              margin="normal"
              placeholder="Código de segurança"
              value={order.creditCard.card_cvv}
              onChange={e => handleChange('card_cvv', e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
        <TextField
          label="CPF do titular do cartão"
          margin="normal"
          placeholder="CPF do titular do cartão"
          value={order.creditCard.card_owner_cpf}
          onChange={e => handleChange('card_owner_cpf', e.target.value)}
          fullWidth
        />
      </Grid>
    </Grid>
  );
}
