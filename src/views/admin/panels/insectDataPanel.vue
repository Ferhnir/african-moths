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
                    <!-- ADD NEW ELEMENT BUTTON -->
                    <div class="form-group col">
                      <button type="button" class="btn btn-sm btn-success" @click="addNewElement()" :disabled="addNewElementBtnn">Add new</button>
                    </div>
                    <!-- COMBOBOX FOR PARENTS -->
                    <div class="form-group col" style="text-align: right;" v-if="$route.params.parent">
                      <label>
                        <parent-combobox 
                          :parent-obj="insectDataList.parent" 
                          :parent-selected="''" 
                          @selected-parent="getSelectedParentID" 
                          :disabled="adding || editing">
                        </parent-combobox>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <table class="table table-responsive-md table-sm">
                  <!-- TABLE HEADER VIEW -->
                  <table-view-header :table-header-obj="tableHeaderObj[$route.params.panel]"></table-view-header>
                  <!-- TABLE BODY VIEW -->
                  <tbody>
                    <tr v-for="(el, key) in tempDataList" :key="key.id">
                      <td v-for="(objKeyName, objKey) in tableHeaderObj[$route.params.panel]" :key="objKey">
                        <div class="input-group" v-if="inputFormValidation(objKeyName, el['id'])">
                          <input type="text" class="form-control form-control-sm" placeholder="Type new name" v-model="el[objKeyName]">
                        </div>
                        <span v-if="comboboxDisplayFormValidation(el['id'],objKeyName)">
                          <parent-combobox 
                            :parent-obj="insectDataList.parent" 
                            :parent-selected="selectedParentID" 
                            :parent-existing-id="el[objKeyName]" 
                            @selected-parent="updateParentID" 
                            :disabled="comboboxFormValidation(el['id'])">
                          </parent-combobox>
                        </span>
                        <span v-if="displayFromValidation(el,objKeyName)">
                          {{ parseObjName(el[objKeyName], objKeyName) }}
                        </span>
                      </td>      
                      <!-- ACTIONS BTTNS -->
                      <td class="text-center" style="vertical-align: middle">                        
                          <a 
                            @click="saveElement(el)" 
                            v-if="addActionValidation(key, el['id'])">
                              <icon name="save" scale="1" style="color:green;"></icon>
                          </a>
                          <a 
                            @click="editElement(el['id'])" 
                            v-if="editActionValidation(el['id'])">
                              <icon name="pencil" scale="1" style="color:orange;"></icon>
                          </a>
                          <a 
                            @click="closeActionEvent()" 
                            v-if="closeActionValidation(key, el['id'])">
                              <icon name="times" scale="1" style="color:red;"></icon>
                          </a>
                          <a 
                            @click="deleteElement(el['id'])" 
                            v-if="deleteActionValidation(el['id'])">
                              <icon name="trash" scale="1" style="color:red;"></icon>
                          </a>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4" v-if="insectDataList.length === 0">
                        <div class="alert alert-light text-center" role="alert">
                        Table is empty...
                        </div>
                      </td>
                    </tr>
                    <info-box 
                      v-show="error.status" 
                      :message="error.message" 
                      :button-state="bttn.login">
                    </info-box>
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
  name: "insectDataPanel",
  components: {
    tableViewHeader,
    loadingAnimation,
    parentCombobox,
    infoBox
  },
  props: ['tableHeaderObj'],
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
        panel: null,
        parent: null
      }, 
      insectDataObjKeys: {},
      selectedParentID: null,
      newParentID: null,
      parentIDname: null,
      selectedElementID: null,
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
    addNewElementBtnn() {
      if(this.$route.params.parent) {
        return this.adding || this.editing || this.selectedParentID === null || parseInt(this.selectedParentID) === 0;
      } else {
        return this.adding || this.editing;
      }
    },
    tempDataList() {
      var newDataList = [];
      if(parseInt(this.selectedParentID) === 0) {
        this._.forEach(this.insectDataList.panel, (o) => {
          if(!this._.find(this.insectDataList.parent, {id: o[this.parentIDname]})){
            newDataList.push(o);
          }
        });
        return newDataList;
      } else if (this.selectedParentID > 0){
        this._.forEach(this.insectDataList.panel, (o) => {
          if(parseInt(o[this.parentIDname]) === parseInt(this.selectedParentID)){
            newDataList.push(o);
          }          
        });
        return newDataList; 
      } else {
        return this.insectDataList.panel;
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
    //===========================
    //PARENT METHODS
    //===========================
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
      if(!this._.isEmpty(this.insectDataList.parent)) {
        var _name = parentID;
        this.insectDataList.parent.forEach((value) => {
          if(value.id === parseInt(parentID)) {
            _name = value.name;
          }
        });
        return _name;
      }
    },
    getSelectedParentID(selectedID) {
      if(this.adding === true) {
        this.insectDataList.panel.shift();
        this.adding = false;
      }      
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
      return !this._.includes(objKeyName,'id') && ((this.adding && elID === "") || (this.editing === true) && (elID === this.selectedElementID));
    },
    comboboxDisplayFormValidation(elID, objKeyName) {
      return this._.includes(objKeyName,'_id');
    },
    comboboxFormValidation(elID) {
      return !this.editing || this.selectedElementID !== elID;
    },
    displayFromValidation(el, objKeyName) {
      return objKeyName === 'country_code' || objKeyName === 'id' || (this._.includes(objKeyName,'name') && !this.editing) || (this._.includes(objKeyName,'name') && this.editing && el.id !== this.selectedElementID);
    },
    //===========================
    //ACTION BUTTONS
    //===========================
    //ADDING NEW ELEMENT
    addNewElement() {
      this.adding = true;
      this.editing = false;
      this.getObjKeyNames();
      if(this.selectedParentID){
        this.insectDataObjKeys[this.parentIDname] = this.selectedParentID;
      }
      this.insectDataList.panel.unshift(this.insectDataObjKeys);
    },
    addActionValidation(elKey, elID) {
      return (this.adding && elKey === 0) || (this.editing && (elID === this.selectedElementID));
    },
    //EDITING ELEMENT
    editElement(activeID) {
      console.log(activeID);
      this.editing = true;
      this.adding = false;
      this.selectedElementID = activeID;
    },
    editActionValidation(elID) {
      return (elID !== '') && (elID !== this.selectedElementID);
    },
    updateParentID(id) {
      this.newParentID = id;
      console.log(this.newParentID);
    },
    //CANCELING ACTION
    closeActionEvent() {
      if (this.adding == true) {
        this.insectDataList.panel.shift();
        this.adding = false;
      }      
      this.editing = false;
      this.selectedElementID = null;
    },
    closeActionValidation(key, elID) {
      return (this.adding && key) === 0 || (this.editing && (elID === this.selectedElementID));
    },
    //DELETING ELEMENT
    deleteActionValidation(elID) {
      return (elID !== '') && (elID !== this.selectedElementID);
    },
    //===========================
    // AXIOS REQUESTS
    //===========================
    //get DATA
    getData(reqArray) {
      this._.forEach(reqArray,(urlTarget, key) => {
        this.axiosRequest("get",urlTarget, null, key);
      });
    },
    //insert or edit DATA
    saveElement(element) {
      if (this.adding === true) {
        delete element.id;
        this.axiosRequest("post", this.$route.params.panel, element, 'panel');
      } else if (this.editing === true){
        if(this.$route.params.parent){
          if(parseInt(element[this.parentIDname]) !== parseInt(this.newParentID)){
            element[this.parentIDname] = parseInt(this.newParentID);
            this.axiosRequest("put", this.$route.params.panel, element, 'panel');
          }
        } else {
        this.axiosRequest("put", this.$route.params.panel, element, 'panel');
        }
      }
      this.adding = false;
      this.closeActionEvent();
    },
    //delete DATA
    deleteElement(insectTypeID) {
      this.axiosRequest("delete", this.$route.params.panel, { ids: insectTypeID }, 'panel');
    },
    //Main Axios Query
    axiosRequest(method, iURL, data = null, key) {

      this.loading = true;
      axios.defaults.headers.common["X-Authorization"] = this.$session.get("header");
      axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

      axios({
        method: method,
        url: this.apiUrl + iURL,
        data: data
        }).then(response => {
          if (response.status === 200) {
            this.insectDataList[key] = this.reverseItems(response.data);
            this.loading = false;
          }
        }).catch(e => {
          if (e.response.status === 400) {
            this.error.status = true;
            this.error.message = e.response.data.message;

            setTimeout(() => {
              this.error.status = false;
            }, 3000);
          } else if (e.response.status === 401) {
            this.error.status = true;
            this.error.message = e.response.data.message;
            this.bttn.login = true;
          }

          this.loading = false;
        });
    },
    init() {
      this.getObjKeyNames();
      this.getData(this.$route.params);
    },
    getObjKeyNames() {
      this.tableHeaderObj[this.$route.params.panel].forEach(element => {
        this.insectDataObjKeys[element] = "";
      });
      this.parentIDname = this.getParentKeyName(this.tableHeaderObj[this.$route.params.panel]);
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
};
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
