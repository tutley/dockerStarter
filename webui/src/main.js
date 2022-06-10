import Vue from 'vue'
import App from './components/App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import './registerServiceWorker'


Vue.use(VueResource)
Vue.config.productionTip = false

new Vue({
  vuetify,
  created: function() {
    window.Vue = this
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
