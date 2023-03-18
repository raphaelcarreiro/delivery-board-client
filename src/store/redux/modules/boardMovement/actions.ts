import { BoardMovement } from 'src/types/boardMovement';
import { BoardMovementPayment } from 'src/types/boardMovementPayment';
import { BoardOrderProduct } from 'src/types/boardOrderProduct';
import { BoardMovementActions } from './types';

export function setBoardMovement(movement: BoardMovement): BoardMovementActions {
  return {
    type: '@boardMovement/SET_BOARD_MOVEMENT',
    movement,
  };
}

export function setBoardProducts(products: BoardOrderProduct[]): BoardMovementActions {
  return {
    type: '@boardMovement/SET_PRODUCTS',
    products,
  };
}

export function setBoardPayments(payments: BoardMovementPayment[]): BoardMovementActions {
  return {
    type: '@boardMovement/SET_PAYMENTS',
    payments,
  };
}

export function addBoardProducts(products: BoardOrderProduct[]): BoardMovementActions {
  return {
    type: '@boardMovement/ADD_PRODUCTS',
    products,
  };
}

export function addBoardPayment(payment: BoardMovementPayment): BoardMovementActions {
  return {
    type: '@boardMovement/ADD_PAYMENT',
    payment,
  };
}

export function removeBoardProduct(orderProductId: number): BoardMovementActions {
  return {
    type: '@boardMovement/REMOVE_PRODUCT',
    orderProductId,
  };
}

export function removeBoardPayment(paymentId: string): BoardMovementActions {
  return {
    type: '@boardMovement/REMOVE_PAYMENT',
    paymentId,
  };
}

export function updateBoardTotal(): BoardMovementActions {
  return {
    type: '@boardMovement/UPDATE_TOTAL',
  };
}

export function setBoardCustomer(name: string): BoardMovementActions {
  return {
    type: '@boardMovement/SET_CUSTOMER',
    name,
  };
}
