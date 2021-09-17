import React, { useState, useRef } from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'src/store/redux/selector';
import { AddressValidation } from './validation/useAddressValidation';
import { AreaRegion } from 'src/types/address';

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
  handleDistrictSelectChange(value: string): void;
  validation: AddressValidation;
  regions: AreaRegion[];
  areaRegionId: number | null;
}

const AddressForm: React.FC<AddressFormProps> = ({ handleDistrictSelectChange, validation, regions, areaRegionId }) => {
  const restaurant = useSelector(state => state.restaurant);
  const mainAddress = restaurant?.addresses.find(address => address.is_main);
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [district, setDistrict] = useState('');
  const classes = useStyles();
  const inputRefNumber = useRef<HTMLInputElement>(null);

  return (
    <div className={classes.form}>
      <TextField
        error={!!validation.address}
        helperText={!!validation.address && validation.address}
        label="Endereço"
        placeholder="Digite o endereço"
        margin="normal"
        fullWidth
        value={address}
        onChange={event => setAddress(event.target.value)}
      />
      <TextField
        inputRef={inputRefNumber}
        error={!!validation.number}
        helperText={!!validation.number && validation.number}
        label="Número"
        placeholder="Digite o número"
        margin="normal"
        fullWidth
        value={number}
        onChange={event => setNumber(event.target.value)}
      />
      {restaurant?.configs.tax_mode === 'district' ? (
        <TextField
          error={!!validation.areaRegionId}
          helperText={!!validation.areaRegionId && validation.areaRegionId}
          select
          label="Selecione um bairro"
          fullWidth
          value={areaRegionId}
          onChange={event => handleDistrictSelectChange(event.target.value)}
          margin="normal"
        >
          {regions.map(region => (
            <MenuItem key={region.id} value={region.id}>
              {region.name} - {region.formattedTax} (taxa de entrega)
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField
          error={!!validation.district}
          helperText={!!validation.district && validation.district}
          label="Bairro"
          placeholder="Digite o bairro"
          margin="normal"
          fullWidth
          value={district}
          onChange={event => setDistrict(event.target.value)}
        />
      )}
      <TextField
        label="Complemento"
        placeholder="Digite o complemento"
        margin="normal"
        fullWidth
        value={complement}
        onChange={event => setComplement(event.target.value)}
      />
      <TextField
        label="Cidade"
        placeholder="Digite a cidade"
        margin="normal"
        fullWidth
        defaultValue={mainAddress?.city}
        disabled
      />
      <TextField
        label="Estado"
        placeholder="Digite o estado"
        margin="normal"
        fullWidth
        defaultValue={mainAddress?.region}
        disabled
      />
      <button type="submit" style={{ display: 'none' }} />
    </div>
  );
};

export default AddressForm;
