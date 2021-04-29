import { Address } from 'src/types/address';
import { Customer } from 'src/types/customer';
import { User } from 'src/types/user';

export const SET_USER = '@user/SET_USER';
export const REMOVE_USER = '@user/REMOVE_USER';
export const USER_CHANGE = '@user/USER_CHANGE';
export const CUSTOMER_CHANGE = '@user/CUSTOMER_CHANGE';
export const SELECT_IMAGE = '@user/SELECT_IMAGE';
export const DELETE_IMAGE = '@user/DELETE_IMAGE';
export const ADD_ADDRESS = '@user/ADD_ADDRESS';
export const DELETE_ADDRESS = '@user/DELETE_ADDRESS';
export const UPDATE_ADDRESS = '@user/UPDATE_ADDRESS';
export const SET_MAIN_ADDRESS = '@user/SET_MAIN_ADDRESS';
export const SET_CUSTOMER_ADDRESSES = '@user/SET_CUSTOMER_ADDRESSES';

interface SetUserAction {
  type: typeof SET_USER;
  user: User;
}

interface RemoveUserAction {
  type: typeof REMOVE_USER;
}

interface UserChangeAction {
  type: typeof USER_CHANGE;
  index: keyof User;
  value: any;
}

interface CustomerChangeAction {
  type: typeof CUSTOMER_CHANGE;
  index: keyof Customer;
  value: any;
}

interface SelectImageAction {
  type: typeof SELECT_IMAGE;
}

interface DeleteImageAction {
  type: typeof DELETE_IMAGE;
}

interface AddCustomerAddress {
  type: typeof ADD_ADDRESS;
  address: Address;
}

interface DeleteAddressAction {
  type: typeof DELETE_ADDRESS;
  addressId: number;
}

interface UpdateAddressAction {
  type: typeof UPDATE_ADDRESS;
  address: Address;
}

interface SetMainAddressAction {
  type: typeof SET_MAIN_ADDRESS;
  addressId: number;
}

interface SetCustomerAddressesAction {
  type: typeof SET_CUSTOMER_ADDRESSES;
  addresses: Address[];
}

export type UserActionsType =
  | SetMainAddressAction
  | UpdateAddressAction
  | DeleteAddressAction
  | AddCustomerAddress
  | DeleteImageAction
  | SelectImageAction
  | CustomerChangeAction
  | UserChangeAction
  | RemoveUserAction
  | SetUserAction
  | SetCustomerAddressesAction;
