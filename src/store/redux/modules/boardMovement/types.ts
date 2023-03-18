import { BoardMovement } from 'src/types/boardMovement';
import { BoardMovementPayment } from 'src/types/boardMovementPayment';
import { BoardOrderProduct } from 'src/types/boardOrderProduct';

interface SetBoardMovementAction {
  type: '@boardMovement/SET_BOARD_MOVEMENT';
  movement: BoardMovement;
}

interface SetBoardMovementProducts {
  type: '@boardMovement/SET_PRODUCTS';
  products: BoardOrderProduct[];
}

interface SetBoardMovementPayments {
  type: '@boardMovement/SET_PAYMENTS';
  payments: BoardMovementPayment[];
}

interface AddBoardMovementProducts {
  type: '@boardMovement/ADD_PRODUCTS';
  products: BoardOrderProduct[];
}

interface RemoveBoardMovementProduct {
  type: '@boardMovement/REMOVE_PRODUCT';
  orderProductId: number;
}

interface AddBoardMovementPayment {
  type: '@boardMovement/ADD_PAYMENT';
  payment: BoardMovementPayment;
}

interface RemoveBoardMovementPayment {
  type: '@boardMovement/REMOVE_PAYMENT';
  paymentId: string;
}

interface UpdateBoardMovementTotal {
  type: '@boardMovement/UPDATE_TOTAL';
}

interface SetBoardMovementCustomerAction {
  type: '@boardMovement/SET_CUSTOMER';
  name: string;
}

export type BoardMovementActions =
  | SetBoardMovementAction
  | SetBoardMovementProducts
  | AddBoardMovementProducts
  | RemoveBoardMovementProduct
  | AddBoardMovementPayment
  | RemoveBoardMovementPayment
  | UpdateBoardMovementTotal
  | SetBoardMovementPayments
  | SetBoardMovementCustomerAction;
