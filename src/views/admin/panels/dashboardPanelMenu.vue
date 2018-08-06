<template>
  <div class="card">
    <div class="card-header">
      Dashboard tool panel
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-sm-2" v-for="element in menuToolsObj" :key="element.id">
          <router-link class="card-panel-link" :to="'/dashboard/' + element.url">
            <div class="card border-secondary text-center">
              <div class="card-header">
                <p class="card-text text-secondary">
                  <icon scale="1.5" :name="element.icon"></icon>
                </p>
              </div>
              <div class="card-body bg-">
                <p class="card-text text-truncate" style="font-size: 14px;">{{element.name}}</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'dashboardPanelMenu',
    props: ['menuToolsObj'],
    data() {
      return {}
    }
  }
</script>

<style>
  .card-bg {
    background-color: rgb(252, 252, 252);
  }
  a.card-panel-link {
    text-decoration: none;
    color: #000;
    display: block;
    transition: 0.5s;
  }
  a.card-panel-link>div:hover {
    background-color: rgb(245, 245, 245);
    transition: 0.5s;
  }
  .fa-icon {
    width: auto;
    /* You would have to include the following two lines to make this work in Safari */
    max-width: 100%;
    max-height: 100%;
  }
</style>
