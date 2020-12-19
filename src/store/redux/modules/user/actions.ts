import { Address } from 'src/types/address';
import { Customer } from 'src/types/customer';
import { User } from 'src/types/user';
import { UserActionsType } from './types';

export function setUser(user: User): UserActionsType {
  return {
    type: '@user/SET_USER',
    user,
  };
}

export function removeUser(): UserActionsType {
  return {
    type: '@user/REMOVE_USER',
  };
}

export function userChange(index: keyof User, value: any): UserActionsType {
  return {
    type: '@user/USER_CHANGE',
    index,
    value,
  };
}

export function customerChange(index: keyof Customer, value: any): UserActionsType {
  return {
    type: '@user/CUSTOMER_CHANGE',
    index,
    value,
  };
}

export function selectImage(): UserActionsType {
  return {
    type: '@user/SELECT_IMAGE',
  };
}

export function deleteImage(): UserActionsType {
  return {
    type: '@user/DELETE_IMAGE',
  };
}

export function addCustomerAddress(address: Address): UserActionsType {
  return {
    type: '@user/ADD_ADDRESS',
    address,
  };
}

export function deleteCustomerAddress(addressId: number): UserActionsType {
  return {
    type: '@user/DELETE_ADDRESS',
    addressId,
  };
}

export function updateCustomerAddress(address: Address): UserActionsType {
  return {
    type: '@user/UPDATE_ADDRESS',
    address,
  };
}

export function setMainCustomerAddress(addressId: number): UserActionsType {
  return {
    type: '@user/SET_MAIN_ADDRESS',
    addressId,
  };
}
