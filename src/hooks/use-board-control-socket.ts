import { useEffect, useCallback } from 'react';
import { BoardMovementPayment } from 'src/types/boardMovementPayment';
import { BoardOrderProduct } from 'src/types/boardOrderProduct';
import { useDispatch } from 'react-redux';
import {
  addBoardPayment,
  addBoardProducts,
  removeBoardPayment,
  removeBoardProduct,
} from 'src/store/redux/modules/boardMovement/actions';
import { useBoardSocket } from './use-board-socket';

export function useBoardControlSocket(boardSessionId?: string): void {
  const { socket } = useBoardSocket();
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
    if (!boardSessionId) {
      return;
    }

    socket?.emit('subscribe_channel', boardSessionId);

    socket?.on('board_products_added', (products: BoardOrderProduct[]) => handleProductsAdded(products));

    socket?.on('board_payment_added', (payment: BoardMovementPayment) => handlePaymentAdded(payment));

    socket?.on('board_product_deleted', (payload: { order_product_id: number }) =>
      handleProductDeleted(payload.order_product_id)
    );

    socket?.on('board_payment_deleted', (payload: { paymentId: string }) => handlePaymentDeleted(payload.paymentId));

    return () => {
      socket?.off('board_products_added');
      socket?.off('board_products_added');
      socket?.off('board_product_deleted');
      socket?.off('board_payment_deleted');
    };
  }, [handleProductsAdded, handlePaymentAdded, handleProductDeleted, handlePaymentDeleted, boardSessionId, socket]);
}
