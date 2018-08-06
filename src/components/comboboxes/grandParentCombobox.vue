<template>
  <select class="form-control form-control-sm parent-combobox" @change="sendSelected($event.target.value)" :disabled="!grandParentObj && grandParentExist">
      <option :value="0">- Show all -</option>
      <option v-for="parent in filteredParentData" :key="parent.id" :value="parent.id">{{parent.name}}</option>
      <option v-if="false">{{ grandParentObj }}</option>    
    </select>
</template>

<script>
  export default {
    name: 'parentCombobox',
    props: ['parentObj', 'parentName', 'grandParentObj', 'grandParentExist'],
    data() {
      return {
        filteredParentData: {}
      }
    },
    methods: {
      sendSelected(parentSelectedId) {
        var value = {
          [this.parentName]: parentSelectedId
        }
        this.$emit('selected-parent', value);
      },
      filterByParentID(dataObj, grandParentName, grandParentID) {
        var filteredData = {};        
        filteredData = _.filter(dataObj, (o) => {
          if (parseInt(o[grandParentName + '_id']) === parseInt(grandParentID)) {
            return parseInt(o[grandParentName + '_id']) === parseInt(grandParentID);
          } else if (parseInt(grandParentID) === 0) {
            return o;
          }
        });
        return filteredData;
      },
    },
    watch: {
      grandParentObj: function(newVal, oldVal) {
        if (newVal[newVal.name + '_id'] > 0) {
          this.filteredParentData = this.filterByParentID(this.parentObj, newVal.name, newVal[newVal.name + '_id']);
        }
      }
    },
    mounted() {
      this.filteredParentData = this.parentObj;
    }
  }
</script>

<style>
  .parent-combobox,
  .parent-combobox>option {
    text-align: center !important;
    text-indent: 30%;
    margin: auto;
  }
</style>
