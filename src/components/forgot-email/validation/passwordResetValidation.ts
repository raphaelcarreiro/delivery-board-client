import { Dispatch, SetStateAction, useState } from 'react';
import * as yup from 'yup';

export type PasswordResetValidation = {
  email?: string;
  password?: string;
  password_confirmation?: string;
};

type PasswordResetData = {
  email: string;
  password: string;
  password_confirmation: string;
};

type UsePasswordResetValidation = [
  PasswordResetValidation,
  Dispatch<SetStateAction<PasswordResetValidation>>,
  (passwordResetData: PasswordResetData) => Promise<void>
];

export function usePasswordResetValidation(): UsePasswordResetValidation {
  const [validation, setValidation] = useState<PasswordResetValidation>({});

  async function validate(passwordResetData: PasswordResetData) {
    const schema = yup.object().shape({
      email: yup
        .string()
        .email('Informe um e-mail válido')
        .required('Informe o email'),
      password: yup
        .string()
        .min(8, 'A senha deve ter no mínimo 8 caracteres')
        .required('Informe a nova senha'),
      password_confirmation: yup.string().oneOf([yup.ref('password'), undefined], 'Nova senha não confere'),
    });

    try {
      await schema.validate(passwordResetData);
    } catch (err) {
      setValidation({
        [err.path]: err.message,
      });
      throw new Error(err.message);
    }
  }

  return [validation, setValidation, validate];
}