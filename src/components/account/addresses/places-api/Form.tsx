import React, { useEffect, useRef } from 'react';
import { TextField } from '@material-ui/core';
import { Address } from 'src/types/address';
import { AddressValidation } from './validation/useAddressValidation';

interface FormProps {
  validation: AddressValidation;
  handleChange(index: keyof Address, value: string): void;
  address: Address;
}

const Form: React.FC<FormProps> = ({ validation, handleChange, address }) => {
  const inputs = {
    address: useRef<HTMLInputElement>(null),
    number: useRef<HTMLInputElement>(null),
    district: useRef<HTMLInputElement>(null),
    region: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    complement: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const [key] = Object.keys(inputs) as [keyof typeof inputs];

    if (!key || !inputs[key]) return;

    inputs[key].current?.focus();
  }, [validation]); //eslint-disable-line

  return (
    <div>
      <div>
        <TextField
          error={!!validation.address}
          helperText={!!validation.address && validation.address}
          label="Endereço"
          placeholder="Digite o endereço"
          margin="normal"
          fullWidth
          value={address.address}
          onChange={event => handleChange('address', event.target.value)}
          autoCapitalize="words"
          autoComplete="address"
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

        <TextField label="Cidade" placeholder="Digite a cidade" margin="normal" fullWidth defaultValue={address.city} />

        <TextField label="Estado" placeholder="Digite o estado" margin="normal" fullWidth value={address.region} />

        <button type="submit" style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default Form;
