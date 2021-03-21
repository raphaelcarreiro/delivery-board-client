import React, { useContext, useRef, useEffect, useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { setCard } from 'src/store/redux/modules/order/actions';
import CardSecurityCode from 'src/components/masked-input/CardSecurityCode';
import CardExpirationDate from 'src/components/masked-input/CardExperitionDate';
import CpfInput from 'src/components/masked-input/CpfInput';
import CardNumber from 'src/components/masked-input/CardNumber';
import { CheckoutContext } from '../../../Checkout';
import CustomDialog from 'src/components/dialog/CustomDialog';
import PaymentCardActions from './PaymentCardActions';
import { useCardValidation } from '../validation/useCardValidation';
import { useSelector } from 'src/store/redux/selector';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 20,
    [theme.breakpoints.down('sm')]: {
      padding: 0,
      flexDirection: 'column-reverse',
      flexWrap: 'nowrap',
    },
  },
}));

interface PaymentCardProps {
  onExited(): void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ onExited }) => {
  const classes = useStyles();
  const order = useSelector(state => state.order);
  const dispatch = useDispatch();
  const checkout = useContext(CheckoutContext);
  const [name, setName] = useState(order.creditCard.name);
  const [number, setNumber] = useState(order.creditCard.number);
  const [cvv, setCvv] = useState(order.creditCard.cvv);
  const [expirationDate, setExpirationDate] = useState(order.creditCard.expiration_date);
  const [cpf, setCpf] = useState(order.creditCard.cpf);
  const [validation, setValidation, validate] = useCardValidation();

  const inputs = {
    number: useRef<HTMLInputElement>(null),
    name: useRef<HTMLInputElement>(null),
    expiration_date: useRef<HTMLInputElement>(null),
    cvv: useRef<HTMLInputElement>(null),
    cpf: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const [key] = Object.keys(validation) as [keyof typeof inputs];

    if (!key) return;

    inputs[key].current?.focus();
  }, [validation]); //eslint-disable-line

  function handleCardValidation() {
    const card = {
      number,
      name,
      expiration_date: expirationDate,
      cvv,
      cpf,
    };

    setValidation({});

    validate(card)
      .then(() => {
        handleConfirm(card);
      })
      .catch(err => {
        console.error(err);
        checkout.setIsCardValid(false);
      });
  }

  function handleConfirm(card) {
    dispatch(setCard(card));

    checkout.setIsCardValid(true);
    checkout.handleStepNext();
  }

  return (
    <CustomDialog
      title="Cartão"
      handleModalState={onExited}
      componentActions={<PaymentCardActions handleSubmit={handleCardValidation} />}
      maxWidth="sm"
      height="70vh"
    >
      <div className={classes.container}>
        <Grid item xs={12}>
          <TextField
            inputRef={inputs.number}
            error={!!validation.number}
            helperText={validation.number}
            label="Número do cartão"
            margin="normal"
            placeholder="Número do cartão"
            value={number}
            onChange={e => setNumber(e.target.value)}
            fullWidth
            autoFocus
            autoComplete="cc-number"
            type="number"
            inputProps={{
              maxlength: 19,
            }}
          />
          <TextField
            inputRef={inputs.name}
            label="Nome e sobrenome"
            error={!!validation.name}
            helperText={validation.name ? validation.name : 'Assim como está escrito no cartão'}
            margin="normal"
            placeholder="Nome e sobrenome"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            autoComplete="cc-name"
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                inputRef={inputs.expiration_date}
                error={!!validation.expiration_date}
                helperText={validation.expiration_date ? validation.expiration_date : 'MM/AAAA'}
                label="Vencimento"
                margin="normal"
                placeholder="Vencimento do cartão"
                value={expirationDate}
                onChange={e => setExpirationDate(e.target.value)}
                fullWidth
                autoComplete="cc-exp"
                InputProps={{
                  inputComponent: CardExpirationDate as any,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                inputRef={inputs.cvv}
                label="Código"
                error={!!validation.cvv}
                helperText={validation.cvv ? validation.cvv : 'Código de segurança'}
                margin="normal"
                placeholder="Código de segurança"
                value={cvv}
                onChange={e => setCvv(e.target.value)}
                autoComplete="cc-csc"
                fullWidth
                type="number"
                inputProps={{
                  maxlength: 4,
                }}
              />
            </Grid>
          </Grid>
          <TextField
            inputRef={inputs.cpf}
            error={!!validation.cpf}
            helperText={validation.cpf}
            label="CPF do titular do cartão"
            margin="normal"
            placeholder="CPF do titular do cartão"
            value={cpf}
            onChange={e => setCpf(e.target.value)}
            fullWidth
            InputProps={{
              inputComponent: CpfInput as any,
            }}
          />
        </Grid>
      </div>
    </CustomDialog>
  );
};

export default PaymentCard;
