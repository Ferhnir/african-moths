<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">
                            <h4>{{ modalAction.header }}</h4>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <form>
                                <div class="form-group">
                                    <label for="formGroupNewNameInput">New name</label>
                                    <input type="text" class="form-control" id="formGroupNewNameInput" placeholder="New name..." v-model="elData.name">
                                </div>
                                <div class="form-group">
                                    <label for="formGroupPArentCombobox">Assing to</label>
                                    <parent-combobox 
                                        :parent-obj="parentData" 
                                        :parent-name="parentName" 
                                        :parent-exist="elData.parent_id" 
                                        @selected-parent="assingParent">
                                    </parent-combobox>
                                </div>
                            </form>
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer">
                            <button 
                                type="button" 
                                class="btn btn-success"
                                @click="saveElement" 
                                :disabled="bttnValidationAdd">{{ modalAction.bttn }}</button>
                            <button type="button" class="btn btn-warning" @click="$emit('close')">Cancel</button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import parentCombobox from '../comboboxes/parentCombobox.vue';
    export default {
        name: 'newElementFormModal',
        components: {
            parentCombobox
        },
        props: ['modalAction', 'parentObj', 'selectedParentData','panelUrl'],
        data() {
            return {
                apiUrl: this.$store.state.api,
                elData: {
                    parent_id: null
                },
                parentData: {},
                parentName: null,
                bttnName: null
            }
        },
        computed: {
            bttnValidationAdd() {
                return this.checkIfEmpty(this.elData.name) || (this.checkIfEmpty(this.elData.parent_id));            
            },
            bttnValidationEdit() {
                return this.checkIfEmpty(this.elData.name) || (this.checkIfEmpty(this.elData.parent_id)) || (this.elData.parent_id === this.selectedParentData.selected.id);
            }
        },
        methods: {
            assingParent(parentObj) {
                this.resetParentData();
                this.elData.parent_id = parseInt(parentObj.id);
            },
            saveElement() {
                this.axios.defaults.headers.common["X-Authorization"] = this.$session.get("header");
                this.axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

                var data = {};

                if(this.modalAction.method === 'post') {
                    data.name = this.elData.name,
                    data[this.parentName + '_id'] = this.elData.parent_id
                } else if (this.modalAction.method === 'put') {
                    data.id = this.elData.id,
                    data.name = this.elData.name,
                    data[this.parentName + '_id'] = this.elData.parent_id
                }
                
                this.axios({
                    method: this.modalAction.method,
                    data: data,
                    url: this.apiUrl + 'insect/' + this.panelUrl
                }).then(response => {
                    this.$emit('close');
                }).catch(error => {
                    console.log(error);
                });
            },
            resetParentData() {
                this.elData.parent_id = null;
            },
            checkIfEmpty(element) {
                if (element == 0 || element == null || element == '') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        mounted() {
            this.parentData = this.parentObj;
            this.parentName = this.selectedParentData.keyName;
            if (this.selectedParentData.selected) {
                this.elData = {
                    id: this.selectedParentData.selected.id,
                    name: this.selectedParentData.selected.name,
                    parent_id: this.selectedParentData.selected[this.parentName + '_id']
                };
            } else {
                this.elData.parent_id = null;
            }            
        }
    }
</script>

<style>
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }
    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }
    .modal-container {
        max-width: 600px;
        margin: 0px auto;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
        border-radius: 10px;
    }
    .modal-body {
        margin: 20px 0;
    }
    .modal-default-button {
        float: right;
    }
    .modal-enter {
        opacity: 0;
    }
    .modal-leave-active {
        opacity: 0;
    }
    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>