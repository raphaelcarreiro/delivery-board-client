import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Socket, io } from 'socket.io-client';
import { setKitchenState } from 'src/store/redux/modules/restaurant/actions';
import { useSelector } from 'src/store/redux/selector';

type UseAppSocket = [Socket, boolean];

const socket = io(`${process.env.NEXT_PUBLIC_SOCKET}/client`);

export function useAppSocket(): UseAppSocket {
  const restaurant = useSelector(state => state.restaurant);
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    if (!restaurant) {
      return;
    }

    socket.emit('register', restaurant.id);

    socket.on('kitchen_state_changed', ({ state }: { state: boolean }) => {
      dispatch(setKitchenState(state));
    });

    return () => {
      socket.off('kitchen_state_changed');
    };
  }, [dispatch, restaurant]);

  useEffect(() => {
    if (restaurant && connected) {
      socket.emit('register', restaurant.id);
    }
  }, [restaurant, connected]);

  return [socket, connected];
}
