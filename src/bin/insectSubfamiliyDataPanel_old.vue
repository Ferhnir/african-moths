<template>
  <div>
    <ul class="list-group">
      <li class="list-group-item active">Insect types panel</li>
      <li class="list-group-item">
        <div class="row">
          <div class="col-md-12">
            <form>
              <div class="form-row">
                <div class="form-group col">
                  <button id="addButton" type="button" class="btn btn-success btn-sm" @click="addNewItem()" :disabled="inputNewName || this.selectedFamilyID == null">Add new</button>
                </div>
                <div class="form-group col" style="text-align: right;">
                  <label>
                    <family-combobox :family-obj="insectDataList.families" :family-selected="''" @selected-family="getSelectedFamilyID" :disabled="inputNewName"></family-combobox>
                  </label>
                </div>
              </div>
            </form>
            <div>
              <div>
                <table class="table table-responsive-xs table-sm">
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th>Subfamily name</th>
                      <th>Family</th>
                      <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, key) in insectSubfamilyList(insectDataList.subfamilies)" :key="key.id">
                      <th class="text-center">{{key}}</th>
                      <td>
                        <div class="input-group" v-if="inputNewName && item.id == ''" >
                          <input type="email" class="form-control form-control-sm" aria-describedby="emailHelp" placeholder="New" v-model="item.name">
                        </div>
                        <div class="input-group" v-if="inputEditName && item.id == activeInputEditID">
                          <input type="email" class="form-control form-control-sm" aria-describedby="emailHelp" placeholder="New name" v-model="item.name">
                        </div>
                        <div v-if="item.id != '' && item.id != activeInputEditID">
                          {{ item.name }}
                        </div>
                      </td>
                      <td>
                        <div class="input-group" v-if="inputNewName && item.id == ''" >
                          <family-combobox :family-obj="insectDataList.families" :family-selected="getFamilyName(item.family_id)" :disabled="inputNewName"></family-combobox>
                        </div>
                        <div class="input-group" v-if="inputEditName && item.id == activeInputEditID">
                          <family-combobox :family-obj="insectDataList.families" :family-selected="getFamilyName(item.family_id)"></family-combobox>
                        </div>
                        <div v-if="item.id != '' && item.id != activeInputEditID">
                          {{ getFamilyName(item.family_id) }}
                        </div>

                      </td>
                      <td class="text-center" style="vertical-align: middle">
                        <a @click="saveNewName(item.name, activeInputEditID)" v-if="inputNewName && key == 0 || inputEditName && item.id == activeInputEditID">
                          <icon name="save" scale="1" style="color:green;"></icon>
                        </a>
                        <a @click="editInsectTypeName(item.id)" v-if="item.id != '' && item.id != activeInputEditID">
                          <icon name="edit" scale="1" style="color:orange;"></icon>
                        </a>
                        <a @click="closeEvent()" v-if="inputNewName && key == 0 || inputEditName && item.id == activeInputEditID">
                          <icon name="times" scale="1" style="color:red;"></icon>
                        </a>

                        <a @click="deleteItem(item.id)" v-if="item.id != '' && item.id != activeInputEditID">
                          <icon name="trash" scale="1" style="color:red;"></icon>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        {{insectSubfamilyList(insectDataList.subfamilies)}}
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
import familyCombobox from './familyCombobox.vue'

export default {
  name: 'insectTypesPanel',
  components: {
    familyCombobox
  },
  data () {
    return {
      apiUrl: 'http://localhost/api_moths/api/insect/',
      error: {
        status: false,
        message: null
      },
      inputNewName: false,
      inputEditName: false,
      insectDataList: {
        subfamilies: null,
        families: null
      },
      activeInputEditID: null,
      tempNewItem: null,
      insectName: null,
      test: '',
      bttn:{
        login: false
      },
      //
      familyArr: null,
      selectedFamilyID: null,
      selectedFamilyName : null
    }
  },
  methods: {
    // FILTER BY FAMILY ID
    insectSubfamilyList: function (insectDataList) {
      var vm = this;
      if(vm.selectedFamilyID != null) {
        return insectDataList.filter(function (name){
          return name.family_id == vm.selectedFamilyID;
        });
      } else {
        return insectDataList;
      }
    },
    //SET ID OF SELECTED FAMILY FROM COMBOBOX
    getSelectedFamilyID (selectedID) {
      this.selectedFamilyID = selectedID;
      this.inputNewName = false;
      this.inputEditName = false;
    },
    getFamilyName (family_id) {
      if(!this._.isEmpty(this.insectDataList.families)){
        var familyName = this._.find(this.insectDataList.families, { 'id': family_id });
        return familyName.name;
      }
    },
    // FORM methods
    closeEvent () {
      if(this.inputNewName == true) {
        this.insectDataList.subfamilies.shift();
      }
      this.inputNewName = false;
      this.inputEditName = false;
      this.activeInputEditID = null;
    },
    addNewItem () {
      // this.tempNewItem = null;
      this.inputNewName = true;
      this.inputEditName = false;
      this.insectDataList.subfamilies.unshift({
        family_id: this.selectedFamilyID,
        id: '',
        name: ''
      });
      this.insectSubfamilyList(this.insectDataList.subfamilies);
    },
    editInsectTypeName (activeID) {
      this.inputEditName = true;
      this.inputNewName = true;
      this.activeInputEditID = activeID;
    },

    // AXIOS REQUESTS

    getList () {
      this.axiosRequest('get','subfamilies');
      this.axiosRequest('get','families');
    },
    saveNewName (typeName, typeID = null) {

      this.closeEvent();

      if(typeID == null) {
        this.axiosRequest('post','subfamilies',{name: typeName, family_id: this.selectedFamilyID});
      } else {
        this.axiosRequest('put','subfamilies',{name: typeName, id: typeID});
      }

    },
    deleteItem (insectTypeID) {
      this.axiosRequest('delete','subfamilies',{ids:insectTypeID});
    },
    reverseItems (items) {
      return items.slice().reverse();
    },
    axiosRequest (method, url, data) {

      axios.defaults.headers.common['Authorization'] = this.$session.get('header');
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

      axios({
        method: method,
        url:  this.apiUrl + url,
        data: data
      })
      .then(response => {
        if (response.status === 200) {

          this.inputNewName = false;
          this.insectDataList[url] = this.reverseItems(response.data);

          // this.familyArr = this._.unionBy(this._.map(this.insectDataList, i => this._.pick(i, 'family_name','family_id')),'family_id');

        }
      })
      .catch(e => {
        console.log(e);
        if (e.response.status === 400) {
          var vm = this;

          vm.error.status = true;
          vm.error.message = e.response.data.message;

          setTimeout(function(){
            vm.error.status = false
          }, 3000);

        } else if (e.response.status === 401) {

          vm.bttn.login = true;

        }
      });

    }
  },
  mounted: function() {
    this.getList();
  }
}
</script>

<style>
</style>
