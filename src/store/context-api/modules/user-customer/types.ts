import { UserState } from './reducer';

export const USER_CHANGE = 'USER_CHANGE';
export const IMAGE_DELETE = 'IMAGE_DELETE';
export const SET_USER = 'SET_USER';

interface UserChangeAction {
  type: typeof USER_CHANGE;
  index: string;
  value: string;
}

interface UserImageDeleteAction {
  type: typeof IMAGE_DELETE;
}

interface SetUserAction {
  type: typeof SET_USER;
  user: UserState;
}

export type UserActionTypes = UserChangeAction | UserImageDeleteAction | SetUserAction;
