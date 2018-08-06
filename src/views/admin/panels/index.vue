<template>
    <el-row>
        <el-col :span="24">
            <router-view name="categoryPageView" />
        </el-col>
    </el-row>
</template>
<script>
    export default {
        name: 'categoryPage'
    }
</script>
<style>

</style>
