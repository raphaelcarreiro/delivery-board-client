import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'src/store/redux/selector';
import { SocialLoginResponse, useAuth } from './auth';

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

const FacebookLoginProvider: React.FC = ({ children }) => {
  const [facebookUser, setFacebookUser] = useState<any | null>(null);
  const restaurant = useSelector(state => state.restaurant);
  const { facebookLogin: handleFacebookLogin } = useAuth();

  useEffect(() => {
    if (!restaurant) return;
    if (restaurant.configs.facebook_login) {
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
    }
  }, [restaurant]);

  const facebookLogin = useCallback(
    () => handleFacebookLogin({ email: facebookUser?.email, name: facebookUser?.name, id: facebookUser?.id }),
    [facebookUser, handleFacebookLogin]
  );

  const facebookLoadProfile = useCallback(
    () =>
      new Promise(resolve => {
        FB.getLoginStatus(response => {
          if (response.status !== 'connected') {
            const userId = response.authResponse.userID;
            FB.login(
              response => {
                if (response.status === 'connected') {
                  FB.api('/me?locale=pt_BR&fields=name,email', (profile: any) => {
                    setFacebookUser({ ...profile, id: userId });
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
