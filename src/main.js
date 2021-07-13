import Vue from 'vue'
import App from './App.vue'
import {store} from './store/notes'
import {router} from './routes'


new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
