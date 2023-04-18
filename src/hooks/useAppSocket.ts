import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Socket, io } from 'socket.io-client';
import { api } from 'src/services/api';
import { setRestaurantIsOpen } from 'src/store/redux/modules/restaurant/actions';
import { useSelector } from 'src/store/redux/selector';

type UseAppSocket = [Socket, boolean];

const socket = io(`${process.env.NEXT_PUBLIC_SOCKET}/client`);

export function useAppSocket(): UseAppSocket {
  const restaurant = useSelector(state => state.restaurant);
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(socket.connected);

  const getRestaurantState = useCallback(() => {
    api
      .get('/restaurant/state')
      .then(response => {
        dispatch(setRestaurantIsOpen(response.data.is_open));
      })
      .catch(err => {
        console.log(err);
      });
  }, [dispatch]);

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

    socket.on('handleRestaurantState', ({ state }: { state: boolean }) => {
      dispatch(setRestaurantIsOpen(state));
    });

    return () => {
      socket.off('handleRestaurantState');
    };
  }, [dispatch, restaurant, getRestaurantState]);

  useEffect(() => {
    if (restaurant && connected) {
      socket.emit('register', restaurant.id);
    }
  }, [restaurant, connected]);

  return [socket, connected];
}
