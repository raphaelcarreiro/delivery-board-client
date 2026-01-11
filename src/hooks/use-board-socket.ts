import { useEffect, useSyncExternalStore } from 'react';
import { useSelector } from 'src/store/redux/selector';
import { SocketStore } from 'src/store/socket-store';

const store = new SocketStore('board');

export function useBoardSocket() {
  const restaurant = useSelector(state => state.restaurant);
  const user = useSelector(state => state.user);

  useEffect(() => {
    if (restaurant) {
      store.connect(restaurant.uuid);
    }
  }, [restaurant]);

  useEffect(() => {
    if (!user.id) {
      store.disconnect();
    }
  }, [user]);

  return useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store),
    store.getSnapshot.bind(store)
  );
}
