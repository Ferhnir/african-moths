<template>
    <div class="card">
        <div class="card-header">
            Subfamily panel
        </div>
        <div class="card-body">
            <form>
                <div class="form-row">
                    <!-- ADD NEW ELEMENT BUTTON -->
                    <div class="form-group col-md-6">
                        <button type="button" class="btn btn btn-success"  style="width:250px;" @click="openAddFormModal">Add subfamily</button>
                    </div>
                    <div class="form-group col-md-6">
                        <div class="float-right" style="width:300px;">
                            <parent-combobox 
                                :parent-obj="dataList.families"
                                :parent-name="parentData.keyName" 
                                @selected-parent="setSelectedParent">
                            </parent-combobox>
                        </div>
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
    </div>
</template>
<script>
    import parentCombobox from '../../components/comboboxes/parentCombobox.vue';
    import modalForm from '../../components/modals/newElementOneParentModalForm.vue';

    export default {
        name: 'subfamilyDataPanel',
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
                    families: [],
                    subfamilies: []
                },        
                panelUrlName: 'subfamilies',   
                //selected parent data
                parentData: {
                    selected: null,
                    keyName: 'family',
                    name: 'families'
                },
                //combobox
                comboboxParent: null,
                //error data
                error: {
                    status: false,
                    message: null
                },
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
                }
            }
        },
        computed: {
            tempDataList() {
                var newDataList = [];
                if(this.comboboxParent) {
                    newDataList = this.filterByParentID(this.dataList.subfamilies, this.comboboxParent.id);
                } else {
                    newDataList = this.dataList[this.panelUrlName];
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
                this.axiosApiRequest('get', null, this.panelUrlName);
                this.axiosApiRequest('get', null, this.parentData.name);
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
            filterByParentID(dataObj, parentID) {
                var filteredData = {};
                filteredData = _.filter(dataObj, (o) => {
                    if(parseInt(o[this.parentData.keyName + '_id']) === parseInt(parentID)) {
                        return parseInt(o[this.parentData.keyName + '_id']) === parseInt(parentID);
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
