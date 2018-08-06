<template>
  <div>
    <loading-animation :animation="loading"></loading-animation>
    <ul class="list-group">
      <li class="list-group-item active">Insect {{$route.params.panel}} panel</li>
      <li class="list-group-item">
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12">
                <form>
                  <div class="form-row">
                    <!-- ADD NEW NAME BUTTON -->
                    <div class="form-group col">
                      <button type="button" class="btn btn-sm btn-success" @click="addNewElement()" :disabled="adding || selectedParentID === null || editing">Add new</button>
                    </div>
                    <!-- END -->
                    <!-- COMBOBOX FOR FAMILIES -->
                    <div class="form-group col" style="text-align: right;" v-if="$route.params.parent">
                      <label>
                        <parent-combobox :parent-obj="insectDataList[$route.params.parent]" :parent-selected="''" @selected-parent="getSelectedParentID" :disabled="adding || editing"></parent-combobox>
                      </label>
                    </div>
                    <!-- END -->
                  </div>
                </form>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <table class="table table-responsive-md table-sm">
                  <!-- TABLE HEADER VIEW -->
                  <table-view-header :table-header-obj="tableHeaderArray"></table-view-header>
                  <!-- TABLE BODY VIEW -->
                  <tbody>
                    <tr v-for="(el, key) in tempDataList" :key="key.id">
                      <td v-for="(objKeyName, objKey) in tableHeaderArray" :key="objKey">
                        <!-- TABLE DISPLAY -->
                        <div class="input-group" v-if="inputFormValidation(objKeyName, el['id'])">
                          <input type="text" class="form-control form-control-sm" placeholder="Type new name" v-model="elNewName">
                        </div>
                        <span v-if="!inputFormValidation(objKeyName, el['id'])">{{ parseObjName(el[objKeyName], objKeyName) }}</span>
                        <!-- END TABLE  -->
                      </td>                      
                      <td class="text-center" style="vertical-align: middle">                        
                          <a 
                            @click="saveElement(elNewName)" 
                            v-if="addActionValidation(key, el['id'])">
                              <icon name="save" scale="1" style="color:green;"></icon>
                          </a>
                          <a 
                            @click="editElement(el['id'],el['name'])" 
                            v-if="editActionValidation(el['id'])">
                              <icon name="pencil" scale="1" style="color:orange;"></icon>
                          </a>
                          <a 
                            @click="deleteElement(el['id'])" 
                            v-if="editActionValidation(el['id'])">
                              <icon name="trash" scale="1" style="color:red;"></icon>
                          </a>
                          <a 
                            @click="closeActionEvent()" 
                            v-if="!editActionValidation(el['id'])">
                              <icon name="times" scale="1" style="color:red;"></icon>
                          </a>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4" v-if="tempDataList === null">
                        <div class="alert alert-light text-center" role="alert">
                        Table is empty...
                      </div>
                      </td>
                    </tr>
                    <info-box 
                      v-show="error.status" 
                      :message="error.message" 
                      :button-state="bttn.login"
                    ></info-box>
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
import axios from "axios";
import loadingAnimation from "@/components/loadingAnimationField.vue";
import tableViewHeader from "@/components/tables/tableDataPanelHeader.vue";
import parentCombobox from '@/components/comboboxes/parentCombobox.vue';
import infoBox from "@/components/infoBox.vue";

export default {
  name: "insectSubfamilyDataPanel",
  components: {
    tableViewHeader,
    loadingAnimation,
    parentCombobox,
    infoBox
  },
  data() {
    return {
      apiUrl: "http://africanmoths.com/api/insect/",
      error: {
        status: false,
        message: null
      },
      //input boxes
      adding: false,
      editing: false,
      //data objects
      insectDataList: {
        subfamilies: null,
        families: null
      },
      tableHeaderArray: ['id','name','family_id'],
      elNewName: "",
      insectDataObjKeys: {},
      selectedParentID: null,
      selectedElementID: null,
      parentKeyName: "",
      //buttons
      bttn: {
        login: false
      },
      //loading animation
      loading: false,
      isLoaded: false,
      objKeyName: ""
    };
  },
  computed: {
    tempDataList() {      
      var dataList = this.insectDataList.subfamilies;
      var newDataList = [];
      if(!this._.isEmpty(dataList)) {
        if(this.selectedParentID) {
          this._.forEach(dataList, (o) => {
            if(parseInt(o.family_id) === parseInt(this.selectedParentID)){
              newDataList.push(o);
            }            
          });
          return newDataList;          
        } else {
          return dataList;
        }
      } else {
        return null;
      }
    }
  },
  methods: {    
    parseObjName(el, key){
      if(this._.includes(key,'_id')){
        return this.getParentName(el);
      } else {
        return el;
      }
    },
    //CHECKS
    reverseItems(items) {
      return items.slice().reverse();
    },
    getParentKeyName(keysArr){
      var _name = "";
      keysArr.forEach((element) => {
        if(this._.includes(element,'_id')){
          _name = element;
        }  
      });
      return _name;    
    },    
    getParentName(parentID) {
      if(!this._.isEmpty(this.insectDataList.families)) {
        var _name = parentID;
        this.insectDataList.families.forEach((value, key) => {
          if(value.id === parseInt(parentID)) {
            _name = value.name;
          }
        });
        return _name;
      }
    },
    getSelectedParentID(selectedID) {
      if(this.adding === true) {
        this.insectDataList.subfamilies.shift();
      }
      this.adding = false;
      this.editing = false;
      if(selectedID === "") {
        this.selectedParentID = null;
      } else {
        this.selectedParentID = selectedID;
      }      
    },
    //===========================
    // FORM 
    //===========================
    inputFormValidation(objKeyName, elID) {
      return !this._.includes(objKeyName,'_id') && (!this._.includes(objKeyName,'id') && (((this.adding === true) && (elID === '')) || ((this.editing === true) && (elID === this.selectedElementID))));
    },
    //===========================
    //ACTION BUTTONS
    //===========================
    //ADDING NEW ELEMENT
    //BUTTON
    addNewElement() {
      this.adding = true;
      this.editing = false;
      this.insectDataList.subfamilies.unshift({
        id: "",
        family_id: this.selectedParentID,
        name: ""        
      });
    },
    //ACTION SAVE
    addActionValidation(elKey, elID) {
      return (elID === "") || (elID === this.selectedElementID && this.editing === true);
    },
    //EDITING ELEMENT
    editElement(activeID,elNAME) {
      this.editing = true;
      this.adding = false;
      this.selectedElementID = activeID;
      this.elNewName = elNAME;
    },
    editActionValidation(elID) {
      return (elID !== '') && (elID !== this.selectedElementID);
    },
    //CANCELING ACTION
    closeActionEvent() {
      if (this.adding === true) {
        this.insectDataList.subfamilies.shift();
      }
      this.adding = false;
      this.editing = false;
      this.elNewName = null;
      this.selectedElementID = null;
    },
    //===========================
    // AXIOS REQUESTS
    //===========================
    //get DATA
    getData(reqArray) {
      reqArray.forEach(urlTarget => {
        this.axiosRequest("get",urlTarget);
      });
    },
    //insert or edit DATA
    saveElement(elName) {
      if (this.adding === true) {
        this.axiosRequest("post", this.$route.params.panel, { name: elName, family_id: this.selectedParentID });
      } else if (this.editing ===true) {
        this.axiosRequest("put", this.$route.params.panel, { name: this.elNewName, family_id: this.selectedParentID, id: this.selectedElementID });
      }
      this.closeActionEvent();
    },
    //delete DATA
    deleteElement(elID) {
      this.axiosRequest("delete", this.$route.params.panel, { ids: elID });
    },
    //Main Axios Query
    axiosRequest(method, iURL, data = null) {

      this.loading = true;
      axios.defaults.headers.common["X-Authorization"] = this.$session.get("header");
      axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

      axios({
        method: method,
        url: this.apiUrl + iURL,
        data: data
      }).then(response => {
          if (response.status === 200) {
            this.insectDataList[iURL] = this.reverseItems(response.data);
            this.adding = false;
            this.loading = false;
            this.elNewName = null;
          }
      }).catch(e => {
        if (e.response.status === 400) {
          this.error.status = true;
          this.error.message = e.response.data.message;
        } else if (e.response.status === 401) {
          this.error.status = true;
          this.error.message = e.response.data.message;
          this.bttn.login = true;
        }
        setTimeout(() => {
            this.error.status = false;
          }, 3000);

        this.loading = false;
      });
    },
    init() {
      this.getData(['subfamilies','families']);
    }
  },
  watch: {
    $route() {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style>
.thead-dark > tr > th:first-child {
  width: 50px !important;
  text-align: center;
}

.table > thead > tr > th:first-child,
.table > tbody > tr > td:first-child {
  width: 50px !important;
  text-align: center;
}
</style>
