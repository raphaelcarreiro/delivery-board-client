import React, { FC, useEffect } from 'react';
import { useSelector } from 'src/store/redux/selector';
import CustomAppbar from '../appbar/CustomAppbar';
import BoardTotal from './BoardTotal';
import { useFetchBoardMovementPayments } from './hooks/useFetchBoardMovementPayments';
import { useFecthBoardMovementProducts } from './hooks/useFetchBoardMovementProducts';

const Board: FC = () => {
  const movement = useSelector(state => state.boardMovement);

  const [isProductsLoading] = useFecthBoardMovementProducts(movement?.id);
  const [isPaymentLoading] = useFetchBoardMovementPayments(movement?.id);

  useEffect(() => {
    console.log(movement);
  }, [movement]);

  return (
    <>
      <CustomAppbar title={movement ? `Mesa ${movement?.board.number} - ${movement.customer.name}` : 'Mesa'} />
      <BoardTotal />
    </>
  );
};

export default Board;
