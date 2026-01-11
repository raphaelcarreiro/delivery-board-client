import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setKitchenState } from 'src/store/redux/modules/restaurant/actions';
import { useSelector } from 'src/store/redux/selector';
import { useClientSocket } from './use-client-socket';

export function useSocketEvents(): void {
  const { socket } = useClientSocket();

  const restaurant = useSelector(state => state.restaurant);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('kitchen_state_changed', (response: { is_kitchen_open: boolean }) => {
      dispatch(setKitchenState(response.is_kitchen_open));
    });

    return () => {
      socket.off('kitchen_state_changed');
    };
  }, [dispatch, restaurant, socket]);
}
