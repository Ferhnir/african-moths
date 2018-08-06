<template>
  <div>
    <ul class="list-group">
      <li class="list-group-item active">Insect {{$route.params.panel}} panel</li>
      <li class="list-group-item">
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12">
                <button type="button" class="btn btn-sm btn-success" @click="addNewTypeName()" :disabled="inputNewName">Add new</button><br />
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <table class="table table-responsive-md table-sm">
                  <thead class="thead-dark">
                    <tr>
                      <th style="width: 50px !important; text-align: center;">#</th>
                      <th scope="col">Name</th>
                      <th scope="col" class="text-center" style="width:150px;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, key) in insectDataList" :key="key.id">
                      <th scope="row" style="text-align: center;">{{key + 1}}</th>
                      <td>
                        <div class="input-group" v-if="inputNewName && key == 0 || inputEditName && item.id == activeInputEditID" >
                           <input type="email" class="form-control form-control-sm" aria-describedby="emailHelp" placeholder="New" v-model="item.name">
                        </div>
                        <div v-if="item.id != '' && item.id != activeInputEditID">
                          {{item.name}}
                        </div>
                      </td>
                      <td class="text-center" style="vertical-align: middle">
                        <a @click="updateData(item.name, activeInputEditID)" v-if="inputNewName && key == 0 || inputEditName && item.id == activeInputEditID">
                          <icon name="save" scale="1" style="color:green;"></icon>
                        </a>
                        <a @click="editInsectTypeName(item.id)" v-if="item.id != '' && item.id != activeInputEditID">
                          <icon name="pencil" scale="1" style="color:orange;"></icon>
                        </a>
                        <a @click="closeEvent()" v-if="inputNewName && key == 0 || inputEditName && item.id == activeInputEditID">
                          <icon name="times" scale="1" style="color:red;"></icon>
                        </a>

                        <a @click="deleteData(item.id)" v-if="item.id != '' && item.id != activeInputEditID">
                          <icon name="trash" scale="1" style="color:red;"></icon>
                        </a>
                      </td>
                    </tr>
                    <tr v-show="error.status">
                      <td class="text-center" colspan="4">
                        <transition name="fade">
                          <div class="alert alert-danger tbl-input-mid" role="alert">
                            {{error.message}}
                            <router-link :to="'/login'" v-if="bttn.login">
                              <span class="glyphicon glyphicon-off"></span> Log in
                            </router-link>
                          </div>
                        </transition>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'insectDataPanel',
  data () {
    return {
      panelName: this.$route.params.panel,
      apiUrl: '',
      error: {
        status: false,
        message: null
      },
      inputNewName: false,
      inputEditName: false,
      insectDataList: [],
      activeInputEditID: null,
      bttn:{
        login: false
      }
    }
  },
  methods: {

    // FORM EVENT methods
    closeEvent () {
      if(this.inputNewName == true) {
        this.insectDataList.shift();
      }
      this.inputNewName = false;
      this.inputEditName = false;
      this.activeInputEditID = null;
    },
    addNewTypeName () {
      this.inputNewName = true;
      this.inputEditName = false;
      this.insectDataList.unshift({
        id: '',
        name: ''
      });
    },
    editInsectTypeName (activeID) {
      this.inputEditName = true;
      this.inputNewName = false;
      this.activeInputEditID = activeID;
    },

    // AXIOS REQUESTS
    getData () {
      this.axiosRequest('get');
    },
    updateData (typeName, typeID = null) {

      this.closeEvent();

      if(typeID == null) {
        this.axiosRequest('post',{name: typeName});
      } else {
        this.axiosRequest('put',{name: typeName, id: typeID});
      }

    },
    deleteData (insectTypeID) {
      this.axiosRequest('delete',{ids:insectTypeID});
    },
    axiosRequest (method, data) {

      axios.defaults.headers.common['Authorization'] = this.$session.get('header');
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

      axios({
        method: method,
        url: this.apiUrl,
        data: data
      })
      .then(response => {
        if (response.status === 200) {

          this.insectDataList = this.reverseItems(response.data);
          this.inputNewName = false;

        }
      })
      .catch(e => {
        if (e.response.status === 400) {

          this.error.status = true;
          this.error.message = e.response.data.message;

          setTimeout(() => {
            this.error.status = false
          }, 3000);

        } else if (e.response.status === 401) {

          this.error.status = true;
          this.error.message = e.response.data.message;
          this.bttn.login = true;

        }
      });
    },
    reverseItems (items) {
      return items.slice().reverse();
    },
    init () {
      this.apiUrl = 'http://africanmoths.com/api/insect/' + this.$route.params.panel;
      this.getData();
    }
  },
  watch: {
    '$route' () {
      this.init();
    }
  },
  mounted (){
      this.init();
  }
}
</script>

<style>
</style>
