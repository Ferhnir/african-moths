<template>
  <div class="card">
    <div class="card-header">
      Tools
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item" v-for="(el, index) in menuToolsObj.tools" :key="index.id">
        <router-link class="dash-menu-link" :to="'/dashboard/' + el.url">
          <icon scale="0.75" :name="el.icon"></icon> {{el.name}}
        </router-link>
      </li>
    </ul>
    <div class="card-header">
      Extras
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item" v-for="(el, index) in menuToolsObj.extras" :key="index.id">
        <router-link class="dash-menu-link" :to="'/dashboard/' + el.url">
          {{el.name}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'dashboardSideMenu',
    props: ['menuToolsObj'],
    data() {
      return {}
    }
  }
</script>

<style>
  .dash-menu-link,
  .dash-menu-link:hover {
    color: #000;
    display: block;
    transition: 0.3s;
  }
  .dash-menu-link:hover {
    text-decoration: none;
    font-weight: bold;
    padding-left: 5px;
    transition: 0.3s;
  }
</style>
