import Vue from 'vue';
import Vuex from 'vuex';
import auth from '@/store/modules/auth.js';

Vue.use(Vuex);

// const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth
  }
});
