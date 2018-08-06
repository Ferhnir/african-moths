<template>
    <div class="card">
        <div class="card-header">
            Genus panel
        </div>
        <div class="card-body">
            <form>
                <div class="form-row">
                    <!-- ADD NEW ELEMENT BUTTON -->
                    <div class="form-group col-md-6">
                        <button type="button" class="btn btn btn-success"  style="width:250px;" @click="openAddFormModal">Add genus</button>
                    </div>
                    <div class="form-group col-md-6">
                        <div class="float-right" style="width:300px;">
                            <ul class="nav nav-tabs" style="margin-bottom:10px;">
                                <li class="nav-item">
                                    <a 
                                    class="nav-link text-center" 
                                    v-bind:class="[navTabFilter.name == 'all' ? 'active':null]" 
                                    @click="switchParentTabFn('all')">All</a>
                                </li>
                                <li class="nav-item">
                                    <a 
                                    class="nav-link text-center" 
                                    v-bind:class="[navTabFilter.name == 'tribes' ? 'active':null]" 
                                    @click="switchParentTabFn('tribes','tribe')">Tribes</a>
                                </li>
                                <li class="nav-item">
                                    <a 
                                    class="nav-link text-center" 
                                    v-bind:class="[navTabFilter.name == 'subfamilies' ? 'active':null]" 
                                    @click="switchParentTabFn('subfamilies','subfamily')">Subfamilies</a>
                                </li>
                            </ul>
                            <div v-if="navTabFilter.name !== 'all'">
                                <parent-combobox 
                                    :parent-obj="dataList[navTabFilter.name]"
                                    :parent-name="navTabFilter.keyName" 
                                    @selected-parent="setSelectedParentData">
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
                        <th style="width: 40%" class="text-center" v-if="navTabFilter.name == 'all'">All parents</th>
                        <th style="width: 40%" class="text-center" v-if="navTabFilter.name == 'tribes'">Tribe name</th>
                        <th style="width: 40%" class="text-center" v-if="navTabFilter.name == 'subfamilies'">Subfamily name</th>
                        <th style="width: 15%" class="text-center">Actions</th>
                    </tr>
                    <tr v-for="(el, key) in tempDataList" :key="key.id">
                        <td class="text-center">{{ el.id }}</td>
                        <td class="text-left">{{ el.name }}</td>
                        <td class="text-center" v-if="navTabFilter.name == 'all'">{{getParentFullName('tribes',el.tribe_id)}} {{getParentFullName('subfamilies',el.subfamily_id)}}</td>
                        <td class="text-center" v-if="navTabFilter.name == 'tribes'">{{ getParentFullName('tribes',el.tribe_id) }}</td>
                        <td class="text-center" v-if="navTabFilter.name == 'subfamilies'">{{ getParentFullName('subfamilies',el.subfamily_id) }}</td>
                        <td class="text-center">
                            <a @click="openEditFormModal(el)" style="margin-right: 5px;">
                                <icon name="edit" scale="1" style="color:orange;"></icon>
                            </a>

                            <a @click="deleteElement(el.id)">
                                <icon name="trash-alt" scale="1" style="color:red;"></icon>
                            </a>
                        </td>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="card-footer d-flex justify-content-center">
            <paginate
                :page-count="totalPages"
                :page-range="itemsPerPage"
                :margin-pages="2"
                :click-handler="clickCallback"
                :prev-text="'Prev'"
                :next-text="'Next'"
                :container-class="'pagination'"
                :page-class="'page-item'"
                :page-link-class="'page-link'" 
                :prev-class="'page-link'" 
                :next-class="'page-link'">
            </paginate>
        </div>
        <modal-form 
            v-if="showModal" 
            :panel-name="panelName" 
            :form-target-name="modalHeader"
            :selected-element-data="editElementData" 
            :modal-method="modalMethod"
            :parent-obj="dataList" 
            :parent-obj-names="[{name: 'tribe',key: 'tribes'},{name:'subfamily',key:'subfamilies'}]" 
            @close="closeAddFormModal">
        </modal-form>
    </div>
</template>
<script>
    import parentCombobox from '../../components/comboboxes/parentCombobox.vue';
    import modalForm from '../../components/modals/newElementTwoParentFormModal.vue';

    export default {
        name: 'genusDataPanel',
        components: {
            parentCombobox,
            modalForm
        },
        data() {
            return {
                //api
                apiUrl: this.$store.state.api,
                //main data
                dataList: {
                    tribes: [],
                    subfamilies: [],
                    genus: []
                },                
                panelName: 'genus',   
                //selected parent data
                parentData: null,
                editElementData: null,
                //error data
                error: {
                    status: false,
                    message: null
                },
                //tab filter
                navTabFilter: {
                    name: 'all',
                    keyName: null
                },
                //pagination
                currentPage: 0,
                itemsPerPage: 10,
                resultCount: 0,                
                //modal
                showModal: false,
                modalHeader: null,
                modalMethod: null
            }
        },
        computed: {
            tempDataList() {
                var newDataList = [];
                if(this.navTabFilter.keyName) {
                    newDataList = this.filterDataByTabName(this.dataList.genus, this.navTabFilter.keyName);
                    if(this.parentData) {
                        newDataList = this.filterByParentID(newDataList, this.navTabFilter.keyName, this.parentData.id);
                    }
                } else {
                    newDataList = this.dataList.genus;
                }
                return this.filterDataPerPage(newDataList,this.currentPage);
            },
            totalPages: function() {
                return Math.ceil(this.resultCount / this.itemsPerPage)
            }
        },
        methods: {
            //==================
            // MODALS
            //==================
            openAddFormModal() {
                this.modalHeader = 'Add new Element';
                this.modalMethod = 'post';
                this.showModal = true;
                this.editElementData = null;
            },
            closeAddFormModal(){
                this.showModal = false;
                this.axiosApiRequest('get', null, 'genus');
            },
            openEditFormModal(activeElement) {
                this.modalHeader = 'Edit element';
                this.modalMethod = 'put';
                this.editElementData = activeElement;
                this.showModal = true;
            },
            //===================
            //action methods
            //===================
            deleteElement(elID) {
                this.axiosApiRequest('delete', {
                    ids: elID
                }, 'genus');
            },
            //===================
            //AXIOS REQUEST
            //===================
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
                    this.loading = false;
                }).catch(error => {
                    this.error.message = error;
                    this.loading = false;
                });
            },
            reverseItems(items) {
                return items.slice().reverse();
            },
            //==============
            // FILTERS
            //==============
            getParentFullName(parent,parentID) {
                var parentName = null;
                if(!_.isEmpty(this.dataList) && parentID !== null) {
                    _.find(this.dataList[parent], (o) => {
                        if(parseInt(o.id) === parseInt(parentID)){
                            parentName = o.name
                        }  
                    });
                    return parentName;
                }
            },
            switchParentTabFn(_objectName,_keyName = null){                
                this.navTabFilter.name = _objectName;
                this.navTabFilter.keyName = _keyName;
                this.parentData = null
            },
            setSelectedParentData(selectedParent) {
                if(parseInt(selectedParent.id) === 0) {
                    this.parentData = null;
                } else {
                    this.parentData = selectedParent;
                }
            },
            filterDataByTabName(dataObj, tabName) {
                var filteredData = {};
                filteredData = _.filter(dataObj, (o) => {
                    return Number.isInteger(o[tabName + '_id']);
                });
                return filteredData;
            },
            filterByParentID(dataObj, tabName, parentID) {
                var filteredData = {};
                filteredData = _.filter(dataObj, (o) => {
                    if(parseInt(o[tabName + '_id']) === parseInt(parentID)) {
                        return parseInt(o[tabName + '_id']) === parseInt(parentID);
                    } else if (parseInt(parentID) === 0) {
                        return o;
                    }                    
                });
                return filteredData;
            },    
            clickCallback(pageNum) {
                this.currentPage = pageNum - 1;
            },
            filterDataPerPage(list, currentPage) {
                this.resultCount = list.length;
                if(this.resultCount > 0) {
                    if (currentPage >= this.totalPages) {
                        currentPage = this.totalPages - 1;
                    }
                    var index = currentPage * this.itemsPerPage;
                    return list.slice(index, index + this.itemsPerPage);
                } else {
                    return list;
                }

            }
        },
        mounted() {
            this.getData();
        }
    }
</script>
<style scoped>
</style>
