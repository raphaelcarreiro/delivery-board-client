import { UserRegister } from 'src/types/userRegister';
import { UserRegisterActions } from './types';

export function userChange(index: keyof UserRegister, value: string): UserRegisterActions {
  return {
    type: 'USER_REGISTER_CHANGE',
    index,
    value,
  };
}
