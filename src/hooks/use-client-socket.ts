import { useEffect, useSyncExternalStore } from 'react';
import { useSelector } from 'src/store/redux/selector';
import { SocketStore } from 'src/store/socket-store';

const store = new SocketStore('client');

export function useClientSocket() {
  const restaurant = useSelector(state => state.restaurant);

  useEffect(() => {
    if (restaurant) {
      store.connect(restaurant.uuid);
    }
  }, [restaurant]);

  useEffect(() => {
    return () => {
      store.disconnect();
    };
  }, []);

  return useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store),
    store.getSnapshot.bind(store)
  );
}
