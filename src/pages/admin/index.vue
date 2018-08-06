<template>
    <div>
        <navbar />
            <el-row>
                <el-col :span="4">
                    <side-bar-menu />
                </el-col>
                <el-col :span="20">
                    <router-view name="adminPageView"></router-view>
                </el-col>
            </el-row>
    </div>
</template>
<script>
    import navbar from '@/views/admin/partials/navbar.vue';
    import sideBarMenu from '@/views/admin/partials/sideBarMenu.vue';
    
    export default {
        name: 'adminPage',
        components: {
            navbar,
            sideBarMenu
        }
    }
</script>
<style>

</style>
