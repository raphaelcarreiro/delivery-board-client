import { Dispatch, SetStateAction, useState } from 'react';
import { UserRegister } from 'src/types/userRegister';
import * as yup from 'yup';

export type UserRegisterValidation = {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
};

type UseUserRegisterValidation = [
  UserRegisterValidation,
  Dispatch<SetStateAction<UserRegisterValidation>>,
  (user: UserRegister) => Promise<void>
];

export function useUserRegisterValidation(): UseUserRegisterValidation {
  const [validation, setValidation] = useState<UserRegisterValidation>({});

  async function handleValidation(user: UserRegister) {
    const schema = yup.object().shape({
      passwordConfirm: yup
        .string()
        .min(4, 'A senha deve ter no mínimo 4 caracteres')
        .oneOf([yup.ref('password'), undefined], 'As senhas devem ser iguais')
        .required('A confirmação da senha é obrigatória'),
      password: yup
        .string()
        .min(4, 'A senha deve ter no mínimo 4 caracteres')
        .required('Senha é obrigatória'),
      email: yup
        .string()
        .transform(value => {
          return value.replace(' ', '');
        })
        .email('Você deve informar um email válido')
        .required('O e-mail é obrigatório'),
      phone: yup
        .string()
        .transform(value => {
          return value ? value.replace(/\D/g, '') : '';
        })
        .min(10, 'Telefone inválido')
        .required('O telefone é obrigatório'),
      name: yup.string().required('O nome é obrigatório'),
    });

    try {
      await schema.validate(user);
    } catch (err) {
      setValidation({ [err.path]: err.message });
      throw new Error(err.message);
    }
  }

  return [validation, setValidation, handleValidation];
}
