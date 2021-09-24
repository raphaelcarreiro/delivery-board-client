import { Dispatch, SetStateAction, useState } from 'react';
import { Address } from 'src/types/address';
import { RestaurantConfigTaxMode } from 'src/types/restaurant';
import * as yup from 'yup';

export interface AddressValidation {
  postal_code?: string;
  address?: string;
  number?: string;
  district?: string;
  city?: string;
  region?: string;
  areaRegionId?: string;
}

type UseAddressValidation = [
  AddressValidation,
  Dispatch<SetStateAction<AddressValidation>>,
  (address: Address, taxMode: RestaurantConfigTaxMode) => Promise<void>
];

export function useAddressValidation(): UseAddressValidation {
  async function handleValidation(address: Address, taxMode: RestaurantConfigTaxMode = 'no_tax') {
    const schema = yup.object().shape({
      region: yup.string().required('O estado é obrigatório'),
      city: yup.string().required('A cidade é obrigatória'),
      district: yup.string().test('check_config', 'Bairro é obrigatório', value => {
        if (taxMode !== 'district') {
          return !!value;
        } else return true;
      }),
      areaRegionId: yup.mixed().test('check_area', 'Bairro é obrigatório', value => {
        if (taxMode === 'district') {
          return !!value;
        } else return true;
      }),
      number: yup.string().required('O número é obrigatório'),
      address: yup.string().required('O logradouro é obrigatório'),
      postal_code: yup.string().required('O CEP é obrigatório'),
    });

    try {
      await schema.validate(address);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setValidation({
          [err.path]: err.message,
        });
        throw new Error(err.message);
      }

      throw new Error(err as string);
    }
  }

  const [validation, setValidation] = useState<AddressValidation>({});
  return [validation, setValidation, handleValidation];
}
