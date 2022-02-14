import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  firebaseMessagingIsSupported,
  getFirebaseMessaging,
  initialize as firebaseInitialize,
} from 'src/config/FirebaseConfig';
import { api } from 'src/services/api';
import { useSelector } from 'src/store/redux/selector';

type FirebaseContextValue = {
  getTokenFirebaseMessaging(): void;
  requestPermissionMessaging(): void;
  fmHasToken: boolean;
};

const FirebaseContext = React.createContext<FirebaseContextValue>({} as FirebaseContextValue);

export function useFirebase(): FirebaseContextValue {
  const context = useContext(FirebaseContext);
  return context;
}

const FirebaseProvider: React.FC = ({ children }) => {
  const [fmHasToken, setFmHasToken] = useState(false);
  const user = useSelector(state => state.user);

  const getTokenFirebaseMessaging = useCallback(() => {
    try {
      const firebaseMessaging = getFirebaseMessaging();
      firebaseMessaging
        .getToken()
        .then(token => {
          if (token) {
            setFmHasToken(true);

            const param = {
              token: token,
              device: navigator.platform,
              type: 'client',
            };

            api.post('/pushTokens', param).catch(err => {
              console.log(err);
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (process.browser) firebaseInitialize();
  }, []);

  useEffect(() => {
    if (process.browser)
      if (user.id && firebaseMessagingIsSupported()) {
        getTokenFirebaseMessaging();
      }
  }, [getTokenFirebaseMessaging, user.id]);

  const requestPermissionMessaging = useCallback(() => {
    try {
      const firebaseMessaging = getFirebaseMessaging();
      Notification.requestPermission()
        .then(async () => {
          const token = await firebaseMessaging.getToken();
          setFmHasToken(true);
          const param = {
            token: token,
            device: navigator.platform,
            type: 'client',
          };

          api.post('/pushTokens', param).catch(err => {
            console.log(err);
          });
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <FirebaseContext.Provider value={{ getTokenFirebaseMessaging, requestPermissionMessaging, fmHasToken }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
