import axios, { AxiosInstance, CancelTokenSource } from 'axios';

function getAxiosInstance(): AxiosInstance {
  let instance: AxiosInstance;
  const token = localStorage.getItem(process.env.TOKEN_NAME || '');

  if (token)
    instance = axios.create({
      baseURL: process.env.BASEURL_API,
      headers: {
        Authorization: `Bearer ${token}`,
        RestaurantId: process.env.RESTAURANT_ID,
      },
    });
  else
    instance = axios.create({
      baseURL: process.env.BASEURL_API,
      headers: {
        RestaurantId: process.env.RESTAURANT_ID,
      },
    });

  if (token)
    instance.interceptors.response.use(
      function(response) {
        return response;
      },
      function(error) {
        if (error.response) {
          if (error.response.status === 401) {
            localStorage.removeItem(token);
          } else {
            return Promise.reject(error);
          }
        } else {
          return Promise.reject(error);
        }
      }
    );

  return instance;
}

export function getCancelTokenSource(): CancelTokenSource {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  return source;
}

export { getAxiosInstance as api };
