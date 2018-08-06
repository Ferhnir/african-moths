<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-6 mx-auto">
          <div class="card">
            <div class="card-header">Login:</div>
            <div class="card-body">
              <form @submit.prevent="login">
                <div class="form-group">
                  <label for="Login">Login:</label>
                  <input type="text" v-model="username" class="form-control" id="LoginInput" placeholder="Login">
                </div>
                <div class="form-group">
                  <label for="Password">Password:</label>
                  <input type="password" v-model="password" class="form-control" id="PasswordInput" placeholder="Password">
                </div>
              </form>
              <button class="btn btn-primary" @click="loginFn">Log in</button>
            </div>
          </div>
          <transition name="fade">
            <div class="alert alert-danger gap-60" role="alert" v-show="error.status">
              {{error.message}}
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {AUTH_REQUEST} from '@/store/actions/auth.js'

  export default {
    name: 'login',
    mounted() {
      this.apiURL = this.$store.state.api;
    },
    data() {
      return {
        apiURL: null,
        error: {
          status: false,
          message: null
        },
        login: null,
        password: null
      }
    },
    methods: {
      loginFn() {
        this.error.status = false;
        this.axios.defaults.headers.post['Content-Type'] = 'form-data';
        this.axios({
          method: 'post',
          url: this.apiURL + 'auth',
          data: {
            user: this.login,
            password: this.password
          }
        }).then(response => {
          if (response.status === 200 && parseInt(response.data.token.length) === 148) {
            this.$session.start();
            this.$session.set('jwt', response.data.token);
            this.$session.set('header', 'Bearer ' + response.data.token);
            this.$router.push('/dashboard/insects');
          } else {
            if (response.data.token === null) {
              this.error.message = response.data;
            }
          }
        }).catch(e => {
          this.error.message = e;
          this.error.status = true;
          // if (e.response.status == 401) {
          //   this.error.status = true
          //   this.error.message = 'Login or password is incorrect'
          //   setTimeout(() => {
          //     this.error.status = false
          //   }, 6000);
          // }
        })
      }
    }
  }
</script>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter,
  .fade-leave-to
  /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
  .gap-60 {
    margin-top: 30px;
  }
</style>
