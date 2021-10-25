import { isBefore, lastDayOfMonth } from 'date-fns';
import { Dispatch, SetStateAction, useState } from 'react';
import { cardBrandValidation } from 'src/helpers/cardBrandValidation';
import { cpfValidation } from 'src/helpers/cpfValidation';
import { Card } from 'src/types/card';
import * as yup from 'yup';

export type CardValidation = {
  cvv?: string;
  expiration_date?: string;
  name?: string;
  number?: string;
  cpf?: string;
};

type UseCardValidation = [CardValidation, Dispatch<SetStateAction<CardValidation>>, (card: Card) => Promise<void>];

export function useCardValidation(): UseCardValidation {
  async function handleValidation(card: Card) {
    const schema = yup.object().shape({
      cpf: yup
        .string()
        .transform((value, originalValue) => {
          return originalValue ? originalValue.replace(/\D/g, '') : '';
        })
        .test('cpfValidation', 'CPF inválido', value => {
          return cpfValidation(value);
        })
        .required('CPF é obrigatório'),
      cvv: yup
        .string()
        .min(3, 'o código de segurança deve ter no mínimo 3 digitos')
        .transform((value, originalValue) => {
          return originalValue.replace(/\D/g, '');
        })
        .test('cvvTest', 'code de segurança inválido', (value: string | null | undefined) => {
          if (!value) return false;
          if (value.length < 3) return false;

          return true;
        })
        .required('o código de segurança é obrigatório'),
      expiration_date: yup
        .string()
        .transform((value, originalValue) => {
          return originalValue.replace(/\D/g, '');
        })
        .min(6, 'validade inválida')
        .required('a data de validade do cartão é obrigatória')
        .test('dateValidate', 'validade expirada', (value: string | null | undefined) => {
          if (!value) return false;

          const now = new Date();

          const expirationDate = new Date(parseInt(value.slice(-4)), parseInt(value.slice(0, 2)) - 1, 1);

          if (isBefore(lastDayOfMonth(expirationDate), now)) return false;

          return true;
        }),
      name: yup.string().required('o nome e sobrenome são obrigatórios'),
      number: yup
        .string()
        .transform((value, originalValue) => {
          return originalValue.replace(/\D/g, '');
        })
        .min(12, 'número do cartão inválido')
        .test(
          'cardValidation',
          'infelizmente não trabalhamos com essa bandeira de cartão',
          (value: string | null | undefined) => {
            if (!value) return false;
            return cardBrandValidation(value);
          }
        )
        .required('o número do cartão é obrigatório'),
    });

    try {
      await schema.validate(card);
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

  const [validation, setValidation] = useState<CardValidation>({});
  return [validation, setValidation, handleValidation];
}
