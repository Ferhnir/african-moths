import Vue from 'vue'
import login from './loginRoute'
import admin from './admin'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
      admin,
      login
    ]
});

export default router;
