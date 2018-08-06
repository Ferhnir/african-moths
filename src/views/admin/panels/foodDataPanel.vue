<template>
    <div class="card">
        <div class="card-header">
            Food panel
        </div>
        <div class="card-body">
            <form>
                <div class="form-row">
                    <!-- ADD NEW ELEMENT BUTTON -->
                    <div class="form-group col">
                        <button type="button" class="btn btn btn-success"  style="width:250px;" @click="openAddFormModal">Add food type</button>
                    </div>
                </div>
            </form>
            <table class="table table-responsive-md table-sm">
                <thead class="thead-light">
                    <tr>
                        <th style="width: 5%" class="text-center">#</th>
                        <th style="width: 85%">Name</th>
                        <th style="width: 10%" class="text-center">Actions</th>
                    </tr>
                    <tr v-for="(el, key) in dataList" :key="key.id">
                        <td class="text-center">{{ el.id }}</td>
                        <td>{{ el.name }}</td>
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
        <modal-form 
            v-if="modal.show" 
            :modal-action="modal" 
            :selected-element-data="selectedElement" 
            @close="closeAddFormModal">
        </modal-form>
    </div>
</template>
<script> 
    import modalForm from '../../components/modals/newElementModalForm.vue';

    export default {
        name: 'foodDataPanel',
        components: {
            modalForm
        },
        data() {
            return {
                //api
                apiUrl: this.$store.state.api,
                //main data
                dataList: Object,
                selectedElement: null,     
                panelName: 'food',
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
                    bttn: null,
                    url: 'food'
                }
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
            },
            closeAddFormModal(){
                this.modal.show = false;
                this.axiosApiRequest('get', null, this.panelName);
            },
            openEditFormModal(_selectedEl) {
                this.selectedElement = _selectedEl;
                this.modal.header = 'Edit element';
                this.modal.method = 'put';
                this.modal.bttn = 'Update';
                this.modal.show = true;                
            },         
            //===================
            //action methods
            //===================
            deleteElement(elID) {
                this.axiosApiRequest('delete', {
                    ids: elID
                },this.panelName);
            },
            //===========================================
            getData() {
                this.axiosApiRequest('get', null, this.panelName);
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
                    this.dataList = this.reverseItems(response.data);
                }).catch(error => {
                    this.error.message = error;
                });
            },
            reverseItems(items) {
                return items.slice().reverse();
            },
        },
        mounted() {
            this.getData();
        }
    }
</script>
<style>

</style>
