<template>
  <div>
    <nav aria-label="breadcrumb" style="margin-bottom: -5px;">
      <ol class="breadcrumb">
        <li class="breadcrumb-item" v-for="(item, key) in breadUrlArray"  v-if="key < breadUrlArray.length - 1" :key="key">
          <router-link class="breadcrumb-link" :to="item.url">{{item.name}}</router-link>
        </li>
        <li class="breadcrumb-item active" v-for="(item, key) in breadUrlArray"  v-if="key == breadUrlArray.length - 1" :key="key">{{item.name}}</li>
      </ol>
    </nav>
  </div>
</template>

<script>

export default {
  name: 'dashboardBreadcrumb',
  data () {
    return {
      windowUrl: this.$route.path.split('/')
    }
  },
  computed: {
    breadUrlArray() {
      
      var newUrl = this.windowUrl;
      var ext = '';
      var breadcrumbArr = [];

      newUrl.shift();

      newUrl.map((v) => {
        if(newUrl.length > 1) {
          ext += '/' + v;
        }

        breadcrumbArr.push({
          name: v.charAt(0).toUpperCase() + v.substr(1),
          url: ext
        });
      });

      return breadcrumbArr;
    }
  },
  watch: {
    '$route' () {
      this.windowUrl = this.$route.path.split('/');
    }
  }
}
</script>

<style>

</style>
