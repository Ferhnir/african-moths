<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">
                            <h4>Species filter</h4>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <div class="form-group">
                                <label for="parentSelect">Family:</label>
                                <parent-combobox 
                                    :parent-obj="parentData.family"
                                    :parent-name="'family'" 
                                    :grand-parent-exist="false"
                                    @selected-parent="getParentID">
                                </parent-combobox>
                                <hr />
                            </div>
                            <div class="form-group">
                                <label for="parentSelect">Subfamily:</label>
                                <parent-combobox 
                                    :parent-obj="parentData.subfamily"
                                    :parent-name="'subfamily'" 
                                    :grand-parent-exist="true" 
                                    :grand-parent-obj="selectedGrandParent.family"                                     
                                    @selected-parent="getParentID">
                                </parent-combobox>
                                <hr />
                            </div>
                            <div class="form-group">
                                <label for="parentSelect">Tribe:</label>
                                <parent-combobox 
                                    :parent-obj="parentData.tribe"
                                    :parent-name="'tribe'" 
                                    :grand-parent-exist="true" 
                                    :grand-parent-obj="selectedGrandParent.subfamily"    
                                    @selected-parent="getParentID">
                                </parent-combobox>
                                <hr />
                            </div>
                            <div class="form-group">
                                <label for="parentSelect">Genus:</label>
                                <parent-combobox 
                                    :parent-obj="parentData.genus"
                                    :parent-name="'genus'" 
                                    :grand-parent-exist="true" 
                                    :grand-parent-obj="selectedGrandParent.subfamily"    
                                    @selected-parent="getParentID">
                                </parent-combobox>
                                <hr />
                            </div>
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer">
                            <button type="button" class="btn btn-success" @click="saveFilterData(selectedGrandParent)">
                                Select
                            </button>
                            <button type="button" class="btn btn-warning" @click="$emit('close')">
                                Cancel
                            </button> 
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    import parentCombobox from '../comboboxes/grandParentCombobox.vue';

    export default {
        name: 'speciesModalFilter',
        components: {
            parentCombobox
        },
        props: ['parentData'],
        data() {
            return {
                selectedPaprentsData: {},
                selectedGrandParent: {
                    family: null,
                    subfamily: null,
                    tribe: null,
                    genus: null
                }
            }
        },
        methods: {
            getParentID(parent){
                var parentName = _.keys(parent);
                if(parent[parentName] > 0){
                    this.selectedGrandParent[parentName] = {
                        name: parentName[0],
                        [parentName + '_id']: parseInt(parent[parentName])
                    };
                }
            },
            saveFilterData(data){
                this.$emit('filter-data', data);
                this.$emit('close');
            },
            bttnValidationAddx() {
                return false;
            }
        }
    }
</script>
<style scoped>
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
