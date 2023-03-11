import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { api } from 'src/services/api';
import { setBoardPayments } from 'src/store/redux/modules/boardMovement/actions';
import { BoardMovementPayment } from 'src/types/boardMovementPayment';

export type UseFetchBoardMovementPayment = [boolean];

export function useFetchBoardMovementPayments(movementId?: string): UseFetchBoardMovementPayment {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movementId) {
      return;
    }

    api
      .get<BoardMovementPayment[]>(`/boardMovements/${movementId}/payments`)
      .then(response => {
        dispatch(setBoardPayments(response.data));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [dispatch, movementId]);

  return [loading];
}
