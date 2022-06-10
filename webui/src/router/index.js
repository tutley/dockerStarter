import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    // Each of these routes are loaded asynchronously, when a user first navigates to each corresponding endpoint.
    // The route will load once into memory, the first time it's called, and no more on future calls.
    // This behavior can be observed on the network tab of your browser dev tools.
    {
      path: '/login',
      name: 'login',
      component: function (resolve) {
        require(['@/components/login/Login.vue'], resolve)
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: function (resolve) {
        require(['@/components/signup/Signup.vue'], resolve)
      }
    },    
    {
      path: '/signup/emailSent',
      name: 'emailSent',
      component: function (resolve) {
        require(['@/components/signup/EmailSent.vue'], resolve)
      }
    },    
    {
      path: '/signup/complete/:slug',
      name: 'completeSignup',
      props: true,
      component: function (resolve) {
        require(['@/components/signup/CompleteSignup.vue'], resolve)
      }
      // beforeEnter: guardRoute
    }, 
    {
      path: '/signup/complete',
      name: 'completeTheSignup',
      component: function (resolve) {
        require(['@/components/signup/CompleteSignup.vue'], resolve)
      }
      // beforeEnter: guardRoute
    }, 
    {
      path: '/',
      name: 'dashboard',
      component: function (resolve) {
        require(['@/components/dashboard/Dashboard.vue'], resolve)
      },
    },
    {
      path: '/help',
      name: 'Help',
      component: function (resolve) {
        require(['@/components/help/Help.vue'], resolve)
      }
    },
    {
      path: '/help/:incomingSearch',
      name: 'Help Search',
      props: true,
      component: function (resolve) {
        require(['@/components/help/Help.vue'], resolve)
      }
    },
    {
      path: '/account',
      name: 'Account Home',
      component: function (resolve) {
        require(['@/components/account/Account.vue'], resolve)
      },
      beforeEnter: guardRoute
    }
  ]
})

function guardRoute (to, from, next) {
  // work-around to get to the Vuex store (as of Vue 2.0)
//  const auth = router.app.$options.store.state.auth
  const auth = store.getters.isLoggedIn

  if (!auth) {
    // This shouldn't be necessary but it's a workaround for when someone reloads a page
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    if (accessToken && refreshToken) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })

    // TODO: Maybe display a message when they get blocked from a route?
    // store.dispatch('setErrorMessage', 'Error: you need to be logged in to go')
    }

  } else {
    next()
  }
}

export default router