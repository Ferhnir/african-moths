<template>
  <div class="side-menu">
    <div class="card mb-3">
      <div class="card-header">
        {{ menuType }}
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item" v-for="(el, key) in menuList" v-bind:key="key">
          <router-link :to="{name: 'admin.category.' + el.name}">
            {{ el.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'sideMenu',
    props: ['menuType'],
    data() {
      return {
        menuList: Object
      }
    },
    mounted() {
      this.menuList = this.$store.state.menu.admin.navbar[this.menuType];
    }
  }
</script>

<style>
</style>
