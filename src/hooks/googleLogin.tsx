import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'src/store/redux/selector';
import { SocialLoginResponse, useAuth } from './auth';

type GoogleLoginContextValue = {
  googleUserProfile: gapi.auth2.BasicProfile | null;
  googleLogin(): Promise<SocialLoginResponse>;
  googleLoadProfile(): Promise<boolean>;
};

const GoogleLoginContext = React.createContext<GoogleLoginContextValue>({} as GoogleLoginContextValue);

export function useGoogleLogin(): GoogleLoginContextValue {
  const context = useContext(GoogleLoginContext);
  return context;
}

const GoogleLoginProvider: React.FC = ({ children }) => {
  const [googleUserProfile, setGoogleUserProfile] = useState<gapi.auth2.BasicProfile | null>(null);
  const restaurant = useSelector(state => state.restaurant);
  const { googleLogin: handleGoogleLogin } = useAuth();
  const [googleAuth2, setGoogleAuth2] = useState<gapi.auth2.GoogleAuth | undefined>(undefined);

  useEffect(() => {
    if (!restaurant) return;
    if (!restaurant.configs.google_login) return;

    gapi.load('auth', () => {
      gapi.auth2
        .init({
          client_id: '372525900715-741lc2vnsuj2gs2o2i063eri0ioaeoov.apps.googleusercontent.com',
          scope: 'profile',
        })
        .then(auth => {
          setGoogleAuth2(auth);
        });
    });
  }, [restaurant]);

  useEffect(() => {
    if (!googleAuth2) return;
    const isSigned = googleAuth2.isSignedIn.get();
    if (isSigned) setGoogleUserProfile(googleAuth2.currentUser.get().getBasicProfile());
  }, [restaurant, googleAuth2]);

  const googleLoadProfile = useCallback(
    (): Promise<boolean> =>
      new Promise(resolve => {
        if (!googleAuth2) {
          resolve(false);
          return;
        }

        googleAuth2.signIn({ scope: 'profile email' }).then(googleUser => {
          const profile = googleUser.getBasicProfile();
          setGoogleUserProfile(profile);
          resolve(true);
        });
      }),
    [googleAuth2]
  );

  const googleLogin = useCallback(() => {
    return handleGoogleLogin({
      email: googleUserProfile?.getEmail(),
      name: googleUserProfile?.getName(),
      id: googleUserProfile?.getId(),
    });
  }, [googleUserProfile, handleGoogleLogin]);

  return (
    <GoogleLoginContext.Provider value={{ googleUserProfile, googleLogin, googleLoadProfile }}>
      {children}
    </GoogleLoginContext.Provider>
  );
};

export default GoogleLoginProvider;
