import { Dispatch, SetStateAction, useState } from 'react';
import { Address } from 'src/types/address';
import * as yup from 'yup';

export interface AddressValidation {
  postal_code?: string;
  address?: string;
  number?: string;
  district?: string;
  city?: string;
  region?: string;
}

type UseAddressValidation = [
  AddressValidation,
  Dispatch<SetStateAction<AddressValidation>>,
  (address: Address) => Promise<void>
];

export function useAddressValidation(): UseAddressValidation {
  async function handleValidation(address: Address) {
    const schema = yup.object().shape({
      region: yup
        .string()
        .typeError('O estado é obrigatório')
        .required('O estado é obrigatório'),
      city: yup
        .string()
        .typeError('A cidade é obrigatório')
        .required('A cidade é obrigatória'),
      district: yup
        .string()
        .typeError('O bairro é obrigatório')
        .required('O bairro é obrigatório'),
      number: yup
        .string()
        .typeError('O número é obrigatório')
        .required('O número é obrigatório'),
      address: yup
        .string()
        .typeError('O logradouro é obrigatório')
        .required('O logradouro é obrigatório'),
      postal_code: yup
        .string()
        .typeError('O CEP é obrigatório')
        .required('O CEP é obrigatório'),
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
