import { Dispatch, SetStateAction, useState } from 'react';
import { Address } from 'src/types/address';
import { RestaurantConfigTaxMode } from 'src/types/restaurant';
import * as yup from 'yup';

export interface AddressValidation {
  address?: string;
  number?: string;
  district?: string;
  city?: string;
  region?: string;
}

type UseAddressValidation = [
  AddressValidation,
  Dispatch<SetStateAction<AddressValidation>>,
  (address: Address, taxMode: RestaurantConfigTaxMode) => Promise<void>
];

export function useAddressValidation(): UseAddressValidation {
  async function handleValidation(address: Address) {
    const schema = yup.object().shape({
      region: yup.string().required('O estado é obrigatório'),
      city: yup.string().required('A cidade é obrigatória'),
      district: yup.string().required('O bairro é obrigatório'),
      number: yup.string().required('O número é obrigatório'),
      address: yup.string().required('O logradouro é obrigatório'),
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
