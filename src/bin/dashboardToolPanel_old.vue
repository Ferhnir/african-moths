<template>
    <ul class="list-group">
      <li class="list-group-item active">Dashboard tool panel</li>
      <li class="list-group-item">
        <div class="row">
          <div class="col-md-2" v-for="element in menuToolsObj" :key="element.id">
            <div class="card">
              <router-link class="card-panel-link" :to="'/dashboard/' + element.url">
                <div class="card-body text-center card-bg">
                  <icon scale="2" :name="element.icon"></icon><br /><br />
                  <p class="card-text font-weight-bold text-truncate">{{element.name}}</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </li>
    </ul>
</template>

<script>

export default {
  name: 'dashboardToolPanel',
  props: ['menuToolsObj'],
  data () {
    return {
    }
  }
}
</script>

<style>
  .card-bg {
    background-color: rgb(242, 242, 242);
  }

  a.card-panel-link {
    text-decoration: none;
    color: #000;
    display: block;
    transition: 0.5s;
  }

  a.card-panel-link > div:hover {
    background-color: rgb(200, 200, 200);
    transition: 0.5s;
  }

  .fa-icon {
    width: auto;

    /* You would have to include the following two lines to make this work in Safari */
    max-width: 100%;
    max-height: 100%;
  }

</style>
