import { UserActionTypes, USER_CHANGE, IMAGE_DELETE, SET_USER } from './types';
import { UserState } from './reducer';

export function userChange(index: string, value: string): UserActionTypes {
  return {
    type: USER_CHANGE,
    index,
    value,
  };
}

export function imageDelete(): UserActionTypes {
  return {
    type: IMAGE_DELETE,
  };
}

export function setUser(user: UserState): UserActionTypes {
  return {
    type: SET_USER,
    user,
  };
}
