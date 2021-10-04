import React, { useRef, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AddressValidation } from './validation/useAddressValidation';
import { Address } from 'src/types/address';

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      marginBottom: 72,
    },
  },
}));

interface AddressFormProps {
  handleChange(index: keyof Address, value: any): void;
  validation: AddressValidation;
  address: Address;
}

const AddressForm: React.FC<AddressFormProps> = ({ validation, handleChange, address }) => {
  const classes = useStyles();

  const inputs = {
    address: useRef<HTMLInputElement>(null),
    number: useRef<HTMLInputElement>(null),
    district: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const [key] = Object.keys(validation) as [keyof typeof inputs];
    if (!key) return;
    if (!inputs[key]) return;

    inputs[key].current?.focus();
  }, [validation]); // eslint-disable-line

  return (
    <div className={classes.form}>
      <TextField
        inputRef={inputs.address}
        error={!!validation.address}
        helperText={validation.address}
        label="Endereço"
        placeholder="Digite o endereço"
        margin="normal"
        fullWidth
        value={address.address}
        onChange={event => handleChange('address', event.target.value)}
      />

      <TextField
        inputRef={inputs.number}
        error={!!validation.number}
        helperText={validation.number}
        label="Número"
        placeholder="Digite o número"
        margin="normal"
        fullWidth
        value={address.number}
        onChange={event => handleChange('number', event.target.value)}
      />

      <TextField
        inputRef={inputs.district}
        error={!!validation.district}
        helperText={validation.district}
        label="Bairro"
        placeholder="Digite o bairro"
        margin="normal"
        fullWidth
        value={address.district}
        onChange={event => handleChange('district', event.target.value)}
      />

      <TextField
        label="Complemento"
        placeholder="Digite o complemento"
        margin="normal"
        fullWidth
        value={address.complement}
        onChange={event => handleChange('complement', event.target.value)}
      />

      <TextField
        label="Cidade"
        placeholder="Digite a cidade"
        margin="normal"
        fullWidth
        defaultValue={address.city}
        disabled
      />
      <TextField
        label="Estado"
        placeholder="Digite o estado"
        margin="normal"
        fullWidth
        defaultValue={address.region}
        disabled
      />
      <button type="submit" style={{ display: 'none' }} />
    </div>
  );
};

export default AddressForm;
