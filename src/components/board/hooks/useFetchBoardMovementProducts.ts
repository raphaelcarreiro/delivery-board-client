import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { api } from 'src/services/api';
import { setBoardDiscount, setBoardProducts } from 'src/store/redux/modules/boardMovement/actions';

export type UseFecthBoardMovementProducts = [boolean];

export function useFecthBoardMovementProducts(id?: string): UseFecthBoardMovementProducts {
  const [loading, setLoading] = useState(!!id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) {
      return;
    }

    setLoading(true);

    api
      .get(`/boardMovements/${id}/products`)
      .then(response => {
        dispatch(setBoardProducts(response.data.products));
        dispatch(setBoardDiscount(response.data.discount));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [dispatch, id]);

  return [loading];
}
