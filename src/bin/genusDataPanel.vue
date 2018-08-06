<template>
    <div class="card">
        <div class="card-header">
            Genus panel
        </div>
        <div class="card-body">
            <loading-animation :animation="loading"></loading-animation>
            <form>
                <div class="form-row">
                    <!-- ADD NEW ELEMENT BUTTON -->
                    <div class="form-group col-md-6">
                        <button type="button" class="btn btn btn-success"  style="width:250px;" @click="addNewElement()" :disabled="addNewElementBttn()">Add new</button>
                        <button type="button" class="btn btn btn-success"  style="width:250px;" @click="showModal = true">Add new item</button>
                    </div>
                    <div class="form-group col-md-6">
                        <div class="float-right" style="width:400px;">
                            <ul class="nav nav-tabs" style="margin-bottom:10px;">
                                <li class="nav-item w-50">
                                    <a class="nav-link" v-bind:class="{ 'active': parentTab, 'not-active': !parentTab }" @click="switchTabFn(parentTab)">Tribes</a>
                                </li>
                                <li class="nav-item w-50">
                                    <a class="nav-link" v-bind:class="{ 'active': !parentTab, 'not-active': parentTab }" @click="switchTabFn(parentTab)">Subfamilies</a>
                                </li>
                            </ul>
                            <div v-if="parentTab">
                                <parent-combobox :parent-obj="dataList.tribes" :parent-selected="selectedTribe" @selected-parent="setTribeParentFilterID" :disabled="adding || editing || selectedSubfamilyID !== null">
                                </parent-combobox>
                            </div>
                            <div v-if="!parentTab">
                                <parent-combobox :parent-obj="dataList.subfamilies" :parent-selected="selectedSubfamily" @selected-parent="setSubfamilyParentFilterID" :disabled="adding || editing || selectedTribeID !== null">
                                </parent-combobox>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <table class="table table-responsive-md table-sm">
                <thead class="thead-light">
                    <tr>
                        <th style="width: 5%" class="text-center">#</th>
                        <th style="width: 45%">Genus name</th>
                        <th style="width: 20%" class="text-center">Tribe name</th>
                        <th style="width: 20%" class="text-center">Subfamily name</th>
                        <th style="width: 15%" class="text-center">Actions</th>
                    </tr>
                    <tr v-for="(el, key) in tempDataList" :key="key.id">
                        <td class="text-center">{{ el.id }}</td>
                        <td>
                            <div class="input-group" v-if="inputFormValidation(el.id)">
                                <input type="text" class="form-control form-control-sm" placeholder="Type new name" v-model="el.name">
                            </div>
                            <span v-if="!inputFormValidation(el.id)">{{ el.name }}</span>
                        </td>
                        <td class="text-center">
                            <span class="text-center" v-bind:class="disabledClassValidation(el.subfamily_id)" v-if="comboboxDisplayFormValidation(el.id,'tribe_id')">
                                <parent-combobox 
                                    :parent-obj="dataList.tribes" 
                                    :parent-selected="selectedTribeID" 
                                    :parent-actual-id="el.tribe_id" 
                                    @selected-parent="updateNewTribeParentID"
                                    :disabled="comboboxFormValidation(el['id'])">
                                </parent-combobox>
                            </span>
                        </td>
                        <td class="text-center">
                            <span class="text-center" v-bind:class="disabledClassValidation(el.tribe_id)" v-if="comboboxDisplayFormValidation(el.id,'subfamily_id')">
                                <parent-combobox 
                                    :parent-obj="dataList.subfamilies" 
                                    :parent-selected="selectedSubfamilyID" 
                                    :parent-actual-id="el.subfamily_id" 
                                    @selected-parent="updateNewSubfamilyParentID" 
                                    :disabled="comboboxFormValidation(el['id'])">
                                </parent-combobox>
                            </span>
                        </td>
                        <td class="text-center">
                            <a @click="saveElement(el)" v-if="actionValidationFn(el.id)">
                                <icon name="save" scale="1.5" style="color:green;"></icon>
                            </a>
                            <a @click="editElement(el.id)" v-if="!actionValidationFn(el.id)">
                                <icon name="pencil" scale="1.5" style="color:orange;"></icon>
                            </a>
                            <a @click="closeActionEvent()" v-if="actionValidationFn(el.id)">
                                <icon name="times" scale="1.5" style="color:red;"></icon>
                            </a>
                            <a @click="deleteElement(el.id)" v-if="!actionValidationFn(el.id)">
                                <icon name="trash" scale="1.5" style="color:red;"></icon>
                            </a>
                        </td>
                    </tr>
                </thead>
            </table>
            {{tempDataList}}
        </div>
        <modal 
            v-if="showModal" 
            :form-target-name="'Add new Element'" 
            :first-parent-obj="dataList.tribes" 
            :second-parent-obj="dataList.subfamilies"
            @close="showModal = false">
        </modal>
    </div>
</template>
<script>
    import loadingAnimation from "../../components/loadingAnimationField.vue";
    import parentCombobox from '../../components/comboboxes/parentCombobox.vue';
    import modal from '../../components/modals/newElementFormModal.vue';
    export default {
        name: 'genusDataPanel',
        components: {
            loadingAnimation,
            parentCombobox,
            modal
        },
        data() {
            return {
                showModal: false,
                apiUrl: this.$store.state.api,
                dataList: {
                    tribes: [],
                    subfamilies: [],
                    genus: []
                },
                adding: false,
                editing: false,
                selectedElementID: null,
                selectedTribe: null,
                selectedTribeID: null,
                selectedSubfamily: null,
                selectedSubfamilyID: null,
                newParentID: null,
                error: {
                    status: false,
                    message: null
                },
                loading: false,
                parentFilter: {
                    tribe: null,
                    subfamily: null
                },
                newElement: {
                    name: null,
                    tribe_id: null,
                    subfamily_id: null
                },
                updateElement: {
                    activiy: false,
                    data: {
                        id: null,
                        name: null,
                        tribe_id: null,
                        subfamily_id: null
                    },
                    selectedID: null
                },
                parentTab: true
            }
        },
        computed: {
            tempDataList() {
                var newDataList = [];
                if(parseInt(this.parentFilter.tribe) === 0){
                    console.log('not assigned - tribe');
                    this._.forEach(this.dataList.genus, (o) => {
                        if(o.tribe_id === null){
                            newDataList.push(o);
                        }
                    });
                } else if(parseInt(this.parentFilter.subfamily) === 0) {
                    console.log('not assigned - subfamily');
                    this._.forEach(this.dataList.genus, (o) => {
                        if(o.subfamily_id === null){
                            newDataList.push(o);
                        }
                    });
                } else if (this.parentFilter.tribe) {
                    console.log('specific tribe');
                    this._.forEach(this.dataList.genus, (o) => {
                        console.log(parseInt(o.tribe_id) + '===' + parseInt(this.parentFilter.tribe));
                        if(parseInt(o.tribe_id) === parseInt(this.parentFilter.tribe)){
                            newDataList.push(o);
                        }
                        console.log(newDataList);
                    });                                                
                } else if(this.parentFilter.subfamily) {
                    console.log('specific subfamily');
                    this._.forEach(this.dataList.genus, (o) => {
                        if(parseInt(o.subfamily_id) === parseInt(this.parentFilter.subfamily)){
                            newDataList.push(o);
                        }
                    });
                } else {
                    console.log('show all');
                    newDataList = this.dataList.genus;
                }
                return newDataList;
            }
        },
        methods: {
            //==============
            //BTTNS
            //==============
            addNewElement() {
                this.adding = true;
                this.dataList.genus.unshift({
                    id: 0,
                    name: "",
                    tribe_id: this.parentFilter.tribe,
                    subfamily_id: this.parentFilter.subfamily
                });
            },
            //==============
            // VALIDATIONS
            //==============
            addNewElementBttn() {
                return this.adding || this.editing || this.parentFilterValidation();
            },
            parentFilterValidation() {
                return (this.parentFilter.tribe === null || parseInt(this.parentFilter.tribe) === 0) && (this.parentFilter.subfamily === null || parseInt(this.parentFilter.subfamily) === 0);
            },
            inputFormValidation(elID) {
                return (elID === this.selectedElementID && this.editing) || (elID === 0 && this.adding);
            },
            actionValidationFn(elID) {
                return (this.adding && elID === 0) || (this.editing && (elID === this.selectedElementID));
            },
            comboboxDisplayFormValidation(elID, objKeyName) {
                return this._.includes(objKeyName, '_id');
            },
            comboboxFormValidation(elID) {
                return !this.editing || this.selectedElementID !== elID;
            },
            filterComboboxValidation(elementID) {
                var active = 'active';
                return Number.isInteger(elementID) || elementID > 0 ? active : false;
            },
            disabledClassValidation(elemend_id) {
                var active = 'active';
                return (elemend_id > null || elemend_id) > 0 ? active : false;
            },
            //==================
            // ACTION METHODS
            //==================
            saveElement(el) {
                console.log(this.tempDataList[0]);
                if(this.adding) {
                    this.axiosApiRequest(
                        'post',
                        {
                            name: el.name,
                            tribe_id: el.tribe_id,
                            subfamily_id: el.subfamily_id
                        },
                        'genus'
                    );
                } else if(this.editing) {
                    console.log(this.tempDataList[this.selectedElementID]);
                }
                // if (parseInt(el.id) === 0) {
                //     this.axiosApiRequest('post', {
                //         name: el.name,
                //         subfamily_id: this.selectedParentID
                //     }, 'genus');
                //     this.adding = false;
                //     this.editing = false;
                //     this.selectedElementID = null;
                // } else if (parseInt(el.id) > 0) {
                //     this.axiosApiRequest('put', {
                //         id: el.id,
                //         name: el.name,
                //         subfamily_id: this.newParentID
                //     }, 'genus');
                //     this.editing = false;
                // }
            },
            deleteElement(elID) {
                this.axiosApiRequest('delete', {
                    ids: elID
                }, 'genus');
            },
            editElement(activeElement) {
                this.selectedElementID = activeElement;
                this.editing = true;
                this.adding = false;
            },
            closeActionEvent() {
                if (this.adding == true) {
                    this.dataList.genus.shift();
                    this.adding = false;
                }
                this.editing = false;
                this.selectedElementID = null;
            },
            //===========================================
            getData() {
                this.axiosApiRequest('get', null, 'genus');
                this.axiosApiRequest('get', null, 'tribes');
                this.axiosApiRequest('get', null, 'subfamilies');
            },
            axiosApiRequest(_method, _data, _target) {
                this.axios.defaults.headers.common["X-Authorization"] = this.$session.get("header");
                this.axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                this.loading = true;
                this.axios({
                    method: _method,
                    data: _data,
                    url: this.apiUrl + 'insect/' + _target
                }).then(response => {
                    this.dataList[_target] = this.reverseItems(response.data);
                    this.adding = false;
                    this.editing = false;
                    this.loading = false;
                }).catch(error => {
                    this.error.message = error;
                    this.loading = false;
                });
            },
            reverseItems(items) {
                return items.slice().reverse();
            },
            getSelectedTribeID(selectedID) {
                if (this.adding) {
                    this.resetAdding();
                }
                this.editing = false;
                if (selectedID === "") {
                    this.selectedTribeID = null;
                } else {
                    this.selectedTribeID = selectedID;
                }
            },
            getSelectedSubfamilyID(selectedID) {
                if (this.adding) {
                    this.resetAdding();
                }
                this.editing = false;
                this.selectedSubfamilyID = selectedID;
            },
            resetAdding() {
                this.insectDataList.genus.shift();
                this.adding = false;
            },
            //table list combobox updater
            updateNewTribeParentID(selectedID) {
                this.updateElement.data.tribe_id = selectedID;
            },
            updateNewSubfamilyParentID(selectedID) {
                this.updateElement.data.subfamily_id = selectedID;
            },
            //filter combobox
            setTribeParentFilterID(filter_id) {
                console.log(filter_id);
                this.parentFilter.tribe = filter_id;
            },
            setSubfamilyParentFilterID(filter_id) {
                this.parentFilter.subfamily = filter_id;
            },
            //tab switch fn
            switchTabFn(_target){
                this.parentTab = !_target;
                this.parentFilter.tribe = null;
                this.parentFilter.subfamily = null;
                this.closeActionEvent();
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>
<style>
    .not-active {
        background-color: rgb(240, 240, 240);
    }
</style>
