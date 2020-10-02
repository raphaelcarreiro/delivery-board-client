import axios, { AxiosError, CancelTokenSource } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    RestaurantId: process.env.NEXT_PUBLIC_RESTAURANT_ID,
  },
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_NAME || '');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err: AxiosError) => {
    return Promise.reject(err);
  }
);

api.interceptors.response.use(
  config => {
    return config;
  },
  err => {
    const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_NAME || '');
    if (token)
      if (err.response && err.response.status === 401) {
        localStorage.removeItem(token);
        return;
      }
    return Promise.reject(err);
  }
);

export { api };

export function getCancelTokenSource(): CancelTokenSource {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  return source;
}
