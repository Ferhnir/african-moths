<template>
  <thead class="thead-light">
    <tr>
      <th scope="col" v-for="name in tableHeaderObj" :key="name" style="width: 8rem;">
        {{ name === 'id' ? '#':remove_dash(name)}}
      </th>
      <th scope="col" class="text-center" style="width:150px;">Actions</th>
    </tr>
  </thead> 
</template>

<script>
export default {
  name: 'tableViewHeader',
  props: ['tableHeaderObj'],
  data () {
    return {
    }
  },
  methods: {          
    remove_dash (string) {
      return string.replace("_id", "");
    }
  }
}
</script>

<style>
.thead-light > tr > th::first-letter {
  text-transform: capitalize;
}
</style>
