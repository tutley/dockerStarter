import axios from 'axios'
import store from '../store'
import auth from './auth'

var apiURL = process.env.VUE_APP_API_ROOT + '/api'

const config = {
  baseURL: apiURL,
  withCredentials: false,
}

var api = new axios.create(config)

// append the auth token to each api request, if user is logged in
api.interceptors.request.use(
(config) => {
  const token = store.getters.accessToken;
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, function (err) {
  return Promise.reject(err);
});

// if an API response gives an unauthorized result, refresh the token and try again
api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await refreshToken();
          const accessToken = rs.data.accessToken;
          localStorage.setItem('accessToken', accessToken);
          store.dispatch('setAccessToken', accessToken);
          api.defaults.headers.Authorization = `Bearer $accessToken`;
          return api(originalConfig);
        } catch (e) {
          auth.logout()
          if (e.response && e.response.data) {
            return Promise.reject(e.response.data);
          }
          return Promise.reject(e);
        }
      }
    }
    return Promise.reject(err);
  });

  function refreshToken() {
    const params = { 'refresh_token': store.getters.refreshToken }
    return api.post ('/auth/refresh', params)
  }

export default api