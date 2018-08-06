<template>
    <el-row class="tac">
        <el-col :span="24">
            <h5>Tools:</h5>
            <el-menu default-active="2" lass="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>Categories</span>
                </template>
                <el-menu-item v-for="(category, key) in categories" :index="getIndex(1,key)" :key="key">
                    <router-link :to="{ name: 'admin.category.' + category }" style="display: block;">{{ category }}</router-link>
                </el-menu-item>
            </el-submenu>
            <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span>Other categories</span>
            </el-menu-item>
            <el-menu-item index="3">
                <i class="el-icon-date"></i>
                <span>Statistics</span>
            </el-menu-item>
            <el-menu-item index="4">
                <i class="el-icon-upload"></i>
                <span>Uploads</span>
            </el-menu-item>
            </el-menu>
        </el-col>
</el-row>
</template>


<script>
  export default {
    name: 'sideBarMenu',
    data() {
        return {
            categories: ['families','subfamilies','tribes','genus','species']
        }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      getIndex(number, key) {
          return number + '-' + key;
      }
    }
  }
</script>