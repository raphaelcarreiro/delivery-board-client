import { UserActionTypes, USER_CHANGE, IMAGE_DELETE, SET_USER } from './types';

export interface UserState {
  id?: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  isImageSelected: boolean;
  image: null | {
    id: number;
    imageUrl: string;
  };
}

export const INITIAL_STATE: UserState = {
  name: '',
  email: '',
  cpf: '',
  phone: '',
  isImageSelected: false,
  image: null,
};

export default function user(state = INITIAL_STATE, action: UserActionTypes): UserState {
  switch (action.type) {
    case USER_CHANGE: {
      return {
        ...state,
        [action.index]: action.value,
      };
    }

    case SET_USER: {
      return action.user;
    }

    case IMAGE_DELETE: {
      return {
        ...state,
        image: null,
        isImageSelected: false,
      };
    }

    default: {
      return state;
    }
  }
}
