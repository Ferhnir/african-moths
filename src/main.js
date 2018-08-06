import Vue from 'vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'
import store from './store/store.js'

import lodash from 'lodash'
import VueLodash from 'vue-lodash'

import Paginate from 'vuejs-paginate'
import BootstrapVue from 'bootstrap-vue'

import ElementUI from 'element-ui'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueLodash, lodash);

//register axios headers

axios.defaults.headers.common["X-Authorization"] = localStorage.getItem('user-token');
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

Vue.use(VueAxios, axios);
Vue.component('icon', Icon);
Vue.component('paginate', Paginate)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app');
