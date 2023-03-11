import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { api } from 'src/services/api';
import { setBoardMovement } from 'src/store/redux/modules/boardMovement/actions';

export type UseFetchBoardMovements = [boolean];

export function useFetchBoardMovement(id?: string | null): UseFetchBoardMovements {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) {
      return;
    }

    api
      .get(`/boardMovements/${id}`)
      .then(response => {
        dispatch(setBoardMovement(response.data));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id, dispatch]);

  return [loading];
}
