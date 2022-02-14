import { useMemo } from 'react';
import { useSelector } from 'src/store/redux/selector';

export function useMaxDistance(): number {
  const restaurant = useSelector(state => state.restaurant);

  const maxDistance = useMemo(() => restaurant?.delivery_max_distance || 0, [restaurant]);

  return maxDistance;
}
