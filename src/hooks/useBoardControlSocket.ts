import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { BoardMovementPayment } from 'src/types/boardMovementPayment';
import { BoardOrderProduct } from 'src/types/boardOrderProduct';
import { useDispatch } from 'react-redux';
import { addBoardPayment, addBoardProducts } from 'src/store/redux/modules/boardMovement/actions';

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

  useEffect(() => {
    if (!boardMovementId) {
      return;
    }

    socket.emit('register', boardMovementId);

    socket.on('board_products_added', (products: BoardOrderProduct[]) => handleProductsAdded(products));

    socket.on('board_payment_added', (payment: BoardMovementPayment) => handlePaymentAdded(payment));

    socket.on('reconnect', () => {
      socket.emit('register', boardMovementId);
    });

    return () => {
      socket.off(boardMovementId);
    };
  }, [handleProductsAdded, handlePaymentAdded, boardMovementId]);

  return [isConnected];
}
