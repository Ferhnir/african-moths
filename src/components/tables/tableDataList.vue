<template>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="#ID" width="180">
        </el-table-column>
        <el-table-column prop="name" label="Name">
        </el-table-column>
        <el-table-column label="Operations" width="100">
            <template slot-scope="scope">
                <el-button @click="handleClick" type="text" size="small">Detail</el-button>
                <el-button type="text" size="small">Edit</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: 'tableDataList',
        props: ['tableDataObj'],
        data() {
            return {
                tableData: null
            }
        },
        methods: {
            handleClick() {
                console.log('dziala');
            }
        },
        mounted() {
            this.tableData = this.tableDataObj;
        }
    }
</script>

