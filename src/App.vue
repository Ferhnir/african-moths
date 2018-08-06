<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'AppCore'
}
</script>

<style>
  [class*="row"] {
    margin-right: 0px;
  }

  [class*="col-"] {
    border: 10px solid transparent;
    padding-right: 0px;
  }

  .el-button:active,
  .el-button:focus {
    outline: none;
  }
</style>
