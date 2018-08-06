<template>
    <div class="card">
        <div class="card-header">
            Species panel
        </div>
        <div class="card-body">
            <form>
                <div class="form-row">
                    <!-- ADD NEW ELEMENT BUTTON -->
                    <div class="form-group col-md-3">
                        <button type="button" class="btn btn btn-success"  style="width:250px;" @click="openAddFormModal">Add species</button>
                    </div>
                    <div class="form-group col-md-9">
                        <button type="button" class="btn btn-outline-primary float-right" @click="modalFilter.show = true">
                            Filter <icon name="filter" scale="1"></icon>
                        </button>
                    </div>
                </div>
            </form>
            <table class="table table-responsive-md table-sm">
                <thead class="thead-light">
                    <tr>
                        <th style="width: 5%" class="text-center">#</th>
                        <th style="width: 45%">Subfamiliy name</th>
                        <th style="width: 40%" class="text-center">{{ parentData.name }} name</th>
                        <th style="width: 15%" class="text-center">Actions</th>
                    </tr>
                    <tr v-for="(el, key) in tempDataList" :key="key.id">
                        <td class="text-center">{{ el.id }}</td>
                        <td class="text-left">{{ el.name }}</td>
                        <td class="text-center">{{ getParentFullName(parentData.name,el[parentData.keyName + '_id']) }}</td>
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
            v-if="modal.show" 
            :modal-action="modal" 
            :selected-parent-data="parentData" 
            :parent-obj="dataList[parentData.name]" 
            :panel-url="panelUrlName" 
            @close="closeAddFormModal">
        </modal-form>
        <species-modal-filter
            v-if="modalFilter.show"
            :parent-data="{
                'family': dataList.families,
                'subfamily': dataList.subfamilies,
                'tribe': dataList.tribes,
                'genus': dataList.genus
            }"
            @close="closeModalFilter"
            @filter-data="addParentFilterData">            
        </species-modal-filter>
    </div>
</template>
<script>
    import parentCombobox from '../../components/comboboxes/parentCombobox.vue';
    import modalForm from '../../components/modals/newElementOneParentModalForm.vue';
    import speciesModalFilter from '../../components/modals/speciesModalFilter.vue';

    export default {
        name: 'speciesDataPanel',
        components: {
            parentCombobox,
            modalForm,
            speciesModalFilter
        },
        data() {
            return {
                //api
                apiUrl: this.$store.state.api,
                //main data
                dataList: {
                    species: [],
                    families: [],
                    subfamilies: [],
                    tribes: [],
                    genus: []
                },        
                panelUrlName: 'species',   
                //selected parent data
                parentData: {
                    selected: null,
                    keyName: 'genus',
                    name: 'genus'
                },
                //combobox
                comboboxParent: null,
                //error data
                error: {
                    status: false,
                    message: null
                },                
                //tab filter
                parentFilter: {},
                //pagination
                currentPage: 0,
                itemsPerPage: 10,
                resultCount: 0,                
                //modal
                modal: {
                    show: false,
                    header: null,
                    method: null,
                    bttn: null
                },
                modalFilter: {
                    show: false
                }
            }
        },
        computed: {
            tempDataList() {
                var newDataList = {
                    subfamilies: [],
                    tribes: [],
                    genus: [],
                    filteredData: []
                };
                if(this.parentFilter.family) {
                    newDataList.subfamilies = this.filterByParentID(this.dataList.subfamilies, 'family', this.parentFilter.family.family_id);
                    if(this.parentFilter.subfamily && this.parentFilter.tribe) {
                        newDataList.tribes = this.filterByParentID(this.dataList.tribes, 'subfamily', this.parentFilter.subfamily.subfamily_id);
                        newDataList.genus = this.filterByParentID(this.dataList.genus, 'tribe', this.parentFilter.tribe.tribe_id);
                    } else if (this.parentFilter.subfamily && !this.parentFilter.tribe) {
                        newDataList.genus = this.filterByParentID(this.dataList.genus, 'subfamily', this.parentFilter.subfamily.subfamily_id);
                    }
                } else {
                    newDataList = this.dataList[this.panelUrlName];
                }
                return this.filterDataPerPage(newDataList,this.currentPage);
            },
            totalPages() {
                return Math.ceil(this.resultCount / this.itemsPerPage)
            }
        },
        methods: {
            //==================
            // MODALS
            //==================
            openAddFormModal() {
                this.modal.header = 'Add new element';
                this.modal.method = 'post';
                this.modal.bttn = 'Save';
                this.modal.show = true;
                this.parentData.selected = null;
            },
            closeAddFormModal(){
                this.modal.show = false;
                this.axiosApiRequest('get', null, this.panelUrlName);
            },
            openEditFormModal(activeElement) {
                this.modal.header = 'Edit element';
                this.modal.method = 'put';
                this.modal.bttn = 'Update';
                this.modal.show = true;
                this.parentData.selected = activeElement;
            },
            closeModalFilter() {
                this.modalFilter.show = false;
            },
            //===================
            //action methods
            //===================
            deleteElement(elID) {
                this.axiosApiRequest('delete', {
                    ids: elID
                }, this.panelUrlName);
            },
            //===================
            //AXIOS REQUEST
            //===================
            getData() {
                _.forEach(_.keys(this.dataList), (e) => {
                    this.axiosApiRequest('get',null, e);
                });
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
                }).catch(error => {
                    this.error.message = error;
                });
            },
            reverseItems(items) {
                return items.slice().reverse();
            },
            //==============
            // FILTERS
            //==============
            getParentFullName(parent, parentID) {
                var parentName = null;
                if(!_.isEmpty(this.dataList) && parentID !== null) {
                    _.find(this.dataList[this.parentData.name], (o) => {
                        if(parseInt(o.id) === parseInt(parentID)){
                            parentName = o.name
                        }  
                    });
                    return parentName;
                }
            },
            setSelectedParent(_selected) {
                if(parseInt(_selected.id) === 0) {
                    this.comboboxParent = null;
                } else {
                    this.comboboxParent = _selected;
                }
            },
            filterByParentID(parentObj, parentName, parentID) {
                var filteredData = {};
                filteredData = _.filter(parentObj, (o) => {
                    if(parseInt(o[parentName + '_id']) === parseInt(parentID)) {
                        return parseInt(o[parentName + '_id']) === parseInt(parentID);
                    } else if (parseInt(parentID) === 0) {
                        return o;
                    }                    
                });
                console.log(parentName + ":");
                console.log(filteredData);
                return filteredData;
            },    
            addParentFilterData(data) {
                this.parentFilter = data;
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
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>
<style scoped>
</style>
