import axios from 'axios';

function getAxiosInstance() {
  // let instance;
  const hastoken = false;

  /* if (localStorage.getItem('token')) {
    instance = axios.create({
      baseURL: process.env.BASEURL_API,
      headers: {
        // Authorization: 'Bearer ' + localStorage.getItem('token'),
        RestaurantID: process.env.ID,
      },
    });

    hastoken = true;
  } else */

  const instance = axios.create({
    baseURL: process.env.BASEURL_API,
    headers: {
      RestaurantId: process.env.RESTAURANT_ID,
    },
  });

  if (hastoken)
    instance.interceptors.response.use(
      function(response) {
        return response;
      },
      function(error) {
        if (error.response) {
          if (error.response.status === 401) {
            // localStorage.removeItem('token');
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
