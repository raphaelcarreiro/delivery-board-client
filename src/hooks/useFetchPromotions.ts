import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { api } from 'src/services/api';
import { setPromotions } from 'src/store/redux/modules/promotion/actions';
import { useSelector } from 'src/store/redux/selector';

export function useFetchPromotions(): [boolean] {
  const dispatch = useDispatch();
  const restaurant = useSelector(state => state.restaurant);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurant) {
      return;
    }

    setLoading(true);

    api
      .get('/promotions', { params: { environment: 'board' } })
      .then(response => {
        dispatch(setPromotions(response.data));
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, [dispatch, restaurant]);
  return [loading];
}
