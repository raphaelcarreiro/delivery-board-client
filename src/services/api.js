import axios from 'axios';

function getAxiosInstance() {
  let instance;
  const token = localStorage.getItem(process.env.TOKEN_NAME);

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
            localStorage.removeItem(process.env.TOKEN_NAME);
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

export function getCancelTokenSource() {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  return source;
}

export { getAxiosInstance as api };
