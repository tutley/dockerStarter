import router from '../router'
import store from '../store'
import api from './api'

export default {
  // basic login function
  login (creds, redirect) {
    const params = { 
      'email': creds.email, 
      'password': creds.password 
    }

    api.post('/auth/login', params)
      .then((response) => {
        this._storeToken(response)
        const profile = response.data.profile
        if (!profile.emailValid) {
          store.dispatch('setShowEmailValidation', true)
          router.push({ name: 'emailSent' })
        } else if (!('businessName' in profile)) {
          router.push({ name: 'completeTheSignup'})
        } else if (redirect) {
          router.push({ path: redirect })
        }
        return
      })
      .catch((err) => {
        store.dispatch('setErrorMessage', err.response.data.message)
        return
      })
  },

  // logout of the app
  logout () {
    // clear the user state
    store.dispatch('setProfile', null)
    store.dispatch('setAccessToken', null)
    store.dispatch('setRefreshToken', null)
    // clear localstorage
    localStorage.clear()
    router.push({ name: 'login' })
  },

  _storeToken (response) {
// expecting a response with an auth object containing tokens and a profile object containing user information
    const auth = {
      'accessToken' : response.data.accessToken,
      'refreshToken' : response.data.refreshToken
    }
    const profile = response.data.profile
    store.dispatch('setAccessToken', auth.accessToken)
    store.dispatch('setRefreshToken', auth.refreshToken)
    // refresh token returns a null profile
    if (profile) {
      store.dispatch('setProfile', profile)
    }

    // store token information in localstorage
    localStorage.setItem('accessToken', auth.accessToken)
    localStorage.setItem('refreshToken', auth.refreshToken)
  },

}