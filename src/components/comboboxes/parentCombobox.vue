<template>
  <select class="form-control form-control-sm parent-combobox" @change="sendSelected($event.target.value)">
    <option :value="0">- Show all -</option>
    <option v-for="parent in parentObj" :key="parent.id" :value="parent.id" :selected="parentExist === parent.id">{{parent.name}}</option>    
  </select>
</template>

<script>
export default {
  name: 'parentCombobox',
  props: ['parentObj','parentName','parentExist'],
  methods: {
    sendSelected(parentSelectedId) {
      var value = {
        keyName: this.parentName + '_id',
        id: parentSelectedId
      }
      this.$emit('selected-parent', value);
    }
  }
 }
</script>

<style>
  .parent-combobox,
  .parent-combobox > option {
    text-align:center !important;
    text-indent: 30%;
    margin: auto;
  }
</style>
