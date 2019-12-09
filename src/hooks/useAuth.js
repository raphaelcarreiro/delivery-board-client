import { useContext } from 'react';
import { AppContext } from '../../pages/_app';

export function useAuth() {
  const appContext = useContext(AppContext);
  const user = appContext.user;

  return user
    ? {
        logged: true,
        user,
      }
    : {
        logged: false,
        user: null,
      };
}
