<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">
                            <h4>{{ formTargetName }}</h4>
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
                                    <ul class="nav nav-tabs" style="margin-bottom:10px;">
                                        <li class="nav-item w-50">
                                            <a class="nav-link" 
                                            v-bind:class="{ 
                                                'active': parentTab == parentObjNames[0].name, 
                                                'not-active': parentTab == parentObjNames[1].name}" 
                                            @click="parentTab = parentObjNames[0].name">Tribes</a>
                                        </li>
                                        <li class="nav-item w-50">
                                            <a class="nav-link" 
                                            v-bind:class="{ 
                                                'active': parentTab == parentObjNames[1].name, 
                                                'not-active': parentTab == parentObjNames[0].name }" 
                                            @click="parentTab = parentObjNames[1].name">Subfamilies</a>
                                        </li>
                                    </ul>
                                    <div v-if="parentTab == parentObjNames[0].name">
                                        <parent-combobox 
                                            :parent-obj="parentObj[parentObjNames[0].key]" 
                                            :parent-name="parentObjNames[0].name" 
                                            :parent-exist="elData.tribe_id" 
                                            @selected-parent="assingParent">
                                        </parent-combobox>
                                    </div>
                                    <div v-if="parentTab == parentObjNames[1].name">
                                        <parent-combobox 
                                            :parent-obj="parentObj[parentObjNames[1].key]" 
                                            :parent-name="parentObjNames[1].name" 
                                            :parent-exist="elData.subfamily_id" 
                                            @selected-parent="assingParent">
                                        </parent-combobox>
                                    </div>
                                </div>
                            </form>
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer">
                            <button v-if="modalMethod == 'post'" type="button" class="btn btn-success" 
                                @click="saveElement" 
                                :disabled="disableValidation(elData.name, elData.subfamily_id, elData.tribe_id)">Save</button>
                            <button v-if="modalMethod == 'put'" type="button" class="btn btn-success" 
                                @click="saveElement" 
                                :disabled="disableValidation(elData.name, elData.subfamily_id, elData.tribe_id)">Update</button>
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
        props: ['panelName','formTargetName', 'modalMethod', 'parentObj', 'selectedElementData','parentObjNames'],
        data() {
            return {
                apiUrl: this.$store.state.api,
                parentTab: this.parentObjNames[0].name,
                elData: {
                    name: null,
                    tribe_id: null,
                    subfamily_id: null
                },
                bttnName: null
            }
        },
        methods: {
            assingParent(parentObj) {
                this.resetParentData();
                this.elData[parentObj.keyName] = parseInt(parentObj.id);
            },
            saveElement() {
                this.axios.defaults.headers.common["X-Authorization"] = this.$session.get("header");
                this.axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                this.loading = true;
                this.axios({
                    method: this.modalMethod,
                    data: this.elData,
                    url: this.apiUrl + 'insect/' + this.panelName
                }).then(response => {
                    this.$emit('close');
                }).catch(error => {
                    console.log(error);
                });
            },
            resetParentData(){
                this.elData.tribe_id = null;
                this.elData.subfamily_id = null;
            },
            checkIfEmpty(element){
                if(element == 0 || element == null || element == ''){
                    return true;
                } else {
                    return false;
                }
            },
            disableValidation(name, subfamily_id, tribe_id){
                return this.checkIfEmpty(name) || (this.checkIfEmpty(subfamily_id) && this.checkIfEmpty(tribe_id));
            }
        },
        mounted() {
            if(this.selectedElementData){
                this.elData = this.selectedElementData;
                if(this.elData.tribe_id){
                    this.parentTab = this.parentObjNames[0].name;
                } else if(this.elData.subfamily_id) {
                    this.parentTab = this.parentObjNames[1].name;
                }
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