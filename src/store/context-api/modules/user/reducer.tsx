import { Dispatch, useReducer } from 'react';
import { UserRegister } from 'src/types/userRegister';
import { UserRegisterActions } from './types';

export const INITIAL_STATE: UserRegister = {
  name: '',
  phone: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

export default function userReducer(state = INITIAL_STATE, action: UserRegisterActions): UserRegister {
  switch (action.type) {
    case 'USER_REGISTER_CHANGE': {
      return {
        ...state,
        [action.index]: action.value,
      };
    }
    default: {
      return state;
    }
  }
}

type UseUserRegisterReducer = [UserRegister, Dispatch<UserRegisterActions>];

export function useUserRegisterReducer(): UseUserRegisterReducer {
  const [user, dispatch] = useReducer(userReducer, INITIAL_STATE);
  return [user, dispatch];
}
