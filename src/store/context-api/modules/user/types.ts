export const USER_REGISTER_CHANGE = 'USER_REGISTER_CHANGE';

interface UserRegisterChangeAction {
  type: typeof USER_REGISTER_CHANGE;
  index: string;
  value: string;
}

export type UserRegisterActions = UserRegisterChangeAction;
