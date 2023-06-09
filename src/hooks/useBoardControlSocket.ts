import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { BoardMovementPayment } from 'src/types/boardMovementPayment';
import { BoardOrderProduct } from 'src/types/boardOrderProduct';
import { useDispatch } from 'react-redux';
import {
  addBoardPayment,
  addBoardProducts,
  removeBoardPayment,
  removeBoardProduct,
} from 'src/store/redux/modules/boardMovement/actions';

const socket = io(`${process.env.NEXT_PUBLIC_SOCKET}/board`);

type UseBoardControlSocket = [boolean];

export function useBoardControlSocket(boardMovementId?: string): UseBoardControlSocket {
  const [isConnected] = useState(socket.connected);
  const dispatch = useDispatch();

  const handleProductsAdded = useCallback(
    (products: BoardOrderProduct[]) => {
      dispatch(addBoardProducts(products));
    },
    [dispatch]
  );

  const handlePaymentAdded = useCallback(
    (payment: BoardMovementPayment) => {
      dispatch(addBoardPayment(payment));
    },
    [dispatch]
  );

  const handleProductDeleted = useCallback(
    (orderProductId: number) => {
      dispatch(removeBoardProduct(orderProductId));
    },
    [dispatch]
  );

  const handlePaymentDeleted = useCallback(
    (paymentId: string) => {
      dispatch(removeBoardPayment(paymentId));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!boardMovementId) {
      return;
    }

    socket.emit('register', boardMovementId);

    socket.on('board_products_added', (products: BoardOrderProduct[]) => handleProductsAdded(products));

    socket.on('board_payment_added', (payment: BoardMovementPayment) => handlePaymentAdded(payment));

    socket.on('board_product_deleted', (payload: { order_product_id: number }) =>
      handleProductDeleted(payload.order_product_id)
    );

    socket.on('board_payment_deleted', (payload: { paymentId: string }) => handlePaymentDeleted(payload.paymentId));

    socket.on('reconnect', () => {
      socket.emit('register', boardMovementId);
    });

    return () => {
      socket.off('board_products_added');
      socket.off('board_products_added');
      socket.off('board_product_deleted');
      socket.off('board_payment_deleted');
    };
  }, [handleProductsAdded, handlePaymentAdded, handleProductDeleted, handlePaymentDeleted, boardMovementId]);

  return [isConnected];
}
