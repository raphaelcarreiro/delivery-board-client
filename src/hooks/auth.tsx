import React, { useCallback, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import jwt from 'jsonwebtoken';
import { removeUser, setUser } from 'src/store/redux/modules/user/actions';
import { useApp } from 'src/App';
import { User } from 'src/types/user';
import { api } from 'src/services/api';

interface AuthContextData {
  login(email: string, password: string): Promise<boolean>;
  logout(): Promise<boolean>;
  checkAuth(): boolean;
  checkEmail(email: string): Promise<User>;
  googleLogin(profile: SocialUserProfile): Promise<SocialLoginResponse>;
  facebookLogin(profile: SocialUserProfile): Promise<SocialLoginResponse>;
  isAuthenticated: boolean;
  isLoading: boolean;
  loggingOff: boolean;
}

export type SocialLoginResponse = {
  status: 'logged' | 'redirect';
  redirectUri?: string;
};

export type SocialUserProfile = {
  email?: string;
  name?: string;
};

const AuthContext = React.createContext({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loggingOff, setLoggingOff] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_TOKEN_NAME) return;
    const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_NAME);

    if (token) {
      const payload: any = jwt.decode(token);

      if (payload) setIsAuthenticated(true);

      setIsLoading(true);
      api
        .get(`/users/${payload.sub}`)
        .then(response => {
          dispatch(setUser(response.data));
        })
        .catch(err => {
          if (err.response) console.log(err.response.data.error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [dispatch]);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        api
          .post('/login', { email, password })
          .then(_response => {
            const response = _response.data;
            if (process.env.NEXT_PUBLIC_TOKEN_NAME)
              localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_NAME, response.token);
            dispatch(setUser(response.user));
            setIsAuthenticated(true);
            resolve(true);
          })
          .catch(err => {
            if (err.response) {
              if (err.response.status === 401) reject(new Error('Usuário ou senha inválidos'));
            } else reject(new Error(err.message));
          });
      });
    },
    [dispatch]
  );

  const logout = useCallback((): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setLoggingOff(true);
      api
        .post('/logout')
        .then(() => {
          if (process.env.NEXT_PUBLIC_TOKEN_NAME) localStorage.removeItem(process.env.NEXT_PUBLIC_TOKEN_NAME);
          setIsAuthenticated(false);
          dispatch(removeUser());
          setLoggingOff(false);
          resolve(true);
        })
        .catch(err => {
          setLoggingOff(false);
          reject(new Error(err));
        });
    });
  }, [dispatch]);

  const checkEmail = useCallback((email: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      api
        .get(`/user/show/${email}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 401) reject(new Error('E-mail não encontrado'));
          } else reject(new Error(err.message));
        });
    });
  }, []);

  const checkAuth = useCallback((): boolean => {
    if (!process.env.NEXT_PUBLIC_TOKEN_NAME) return false;
    if (!process.env.NEXT_PUBLIC_SECRET) return false;

    const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_NAME);
    const secret: jwt.Secret = process.env.NEXT_PUBLIC_SECRET;

    if (token) {
      try {
        jwt.verify(token, secret, {
          ignoreNotBefore: true,
        });

        return true;
      } catch (e) {
        console.log(e);
      }
    }

    return false;
  }, []);

  const googleLogin = useCallback(
    (profile: SocialUserProfile): Promise<SocialLoginResponse> =>
      new Promise((resolve, reject) => {
        setIsLoading(true);

        api
          .get(`user/show/${profile.email}`)
          .then(() => {
            api
              .post('login/google', profile)
              .then(response => {
                if (!process.env.NEXT_PUBLIC_TOKEN_NAME) return;
                localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_NAME, response.data.token);
                setIsAuthenticated(true);
                dispatch(setUser(response.data.user));
                resolve({ status: 'logged' });
              })
              .catch(err => {
                if (err.response) reject(new Error(err.response.data.error));
                else reject(new Error('Não foi possível fazer login'));
              });
          })
          .catch(err => {
            if (err.response && err.response.status === 401)
              resolve({
                status: 'redirect',
                redirectUri: `/register?email=${profile.email}&name=${profile.name}`,
              });
            else reject(new Error('Não possível fazer login com o Google'));
          })
          .finally(() => {
            setIsLoading(false);
          });
      }),
    [dispatch]
  );

  const facebookLogin = useCallback(
    (profile: SocialUserProfile): Promise<SocialLoginResponse> =>
      new Promise((resolve, reject) => {
        setIsLoading(true);

        api
          .get(`user/show/${profile.email}`) // verificar se o email cadastro no facebook existe
          .then(() => {
            api
              .post('login/facebook', profile)
              .then(response => {
                if (!process.env.NEXT_PUBLIC_TOKEN_NAME) return;
                localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_NAME, response.data.token);
                setIsAuthenticated(true);
                dispatch(setUser(response.data.user));
                resolve({ status: 'logged' });
              })
              .catch(err => {
                if (err.response) reject(new Error(err.response.data.error));
                else reject(new Error('Não foi possível fazer login'));
              });
          })
          .catch(err => {
            if (err.response && err.response.status === 401)
              resolve({
                status: 'redirect',
                redirectUri: `/register?email=${profile.email}&name=${profile.name}`,
              });
            else reject(new Error('Não possível fazer login com o Facebook'));
          })
          .finally(() => {
            setIsLoading(false);
          });
      }),
    [dispatch]
  );

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        checkAuth,
        checkEmail,
        googleLogin,
        facebookLogin,
        isAuthenticated,
        isLoading,
        loggingOff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) throw new Error('This hook must be in Auth Context Component');

  return context;
}

export default AuthProvider;
