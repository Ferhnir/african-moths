<template>
  <dashboard-panel-menu :menu-tools-obj="menuToolsObj"></dashboard-panel-menu>
</template>

<script>
import dashboardPanelMenu from '../views/panels/dashboardPanelMenu.vue'

export default {
  name: 'dashboardDefaultView',
  props: ['menuToolsObj'],
  components: {
    dashboardPanelMenu
  }
}
</script>

<style>
</style>