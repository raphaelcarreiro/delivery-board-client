import React, { PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { isFacebookNavigator } from 'src/helpers/isFacebookNavigator';
import { setRestaurantConfig } from 'src/store/redux/modules/restaurant/actions';
import { useSelector } from 'src/store/redux/selector';
import { SocialLoginResponse, useAuth } from './AuthProvider';

type FacebookLoginContextValue = {
  facebookUser: any;
  facebookLogin(): Promise<SocialLoginResponse>;
  facebookLoadProfile(): Promise<any>;
};

const FacebookLoginContext = React.createContext<FacebookLoginContextValue>({} as FacebookLoginContextValue);

export function useFacebookLogin(): FacebookLoginContextValue {
  const context = useContext(FacebookLoginContext);
  return context;
}

const FacebookLoginProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [facebookUser, setFacebookUser] = useState<any | null>(null);
  const restaurant = useSelector(state => state.restaurant);
  const { facebookLogin: handleFacebookLogin } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!restaurant) return;
    if (!restaurant.configs.facebook_login) return;

    if (typeof FB === 'undefined') {
      dispatch(setRestaurantConfig('facebook_login', false));
      return;
    }

    if (isFacebookNavigator()) {
      dispatch(setRestaurantConfig('facebook_login', false));
      return;
    }

    FB.init({
      appId: '588242751734818',
      cookie: true,
      xfbml: true,
      version: 'v5.0',
    });

    FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        FB.api('/me?locale=pt_BR&fields=name,email', profile => {
          setFacebookUser(profile);
        });
      }
    });
  }, [dispatch, restaurant]);

  const facebookLogin = useCallback(
    () => handleFacebookLogin({ email: facebookUser?.email, name: facebookUser?.name, id: facebookUser?.id }),
    [facebookUser, handleFacebookLogin]
  );

  const facebookLoadProfile = useCallback(
    () =>
      new Promise(resolve => {
        FB.getLoginStatus(response => {
          if (response.status !== 'connected') {
            // const userId = response.authResponse.userID;
            FB.login(
              response => {
                if (response.status === 'connected') {
                  FB.api('/me?locale=pt_BR&fields=name,email', (profile: any) => {
                    setFacebookUser(profile);
                    resolve(true);
                  });
                }
              },
              { scope: 'public_profile,email' }
            );
          }
        });
      }),
    []
  );

  return (
    <FacebookLoginContext.Provider value={{ facebookLogin, facebookLoadProfile, facebookUser }}>
      {children}
    </FacebookLoginContext.Provider>
  );
};

export default FacebookLoginProvider;
