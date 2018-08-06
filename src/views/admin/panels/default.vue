<template>
    <el-row class="tac">
        <el-col :span="24">
            <h5>Families:</h5>
                <el-table :data="data" style="width: 100%">
                    <el-table-column label="ID" width="80">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Name">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p>Name: {{ scope.row.name }}</p>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="Operations">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
                                Edit</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                        </template>
                    </el-table-column>
                </el-table>
        </el-col>
    </el-row>
</template>

<script>
    import ApiQuery from '@/apiRequests.js'

    export default {
        data() {
            return {
                tableData: [{
                    date: '2016-05-03',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles'
                }, {
                    date: '2016-05-02',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles'
                }, {
                    date: '2016-05-04',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles'
                }, {
                    date: '2016-05-01',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles'
                }]
            }
        },
        methods: {
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                console.log(index, row);
            }
        },
        computed: {
            data() {
                console.log('dziala?');
                console.log(localStorage.getItem('families'));
                return localStorage.getItem('families');
            }
        },
        mounted() {
            ApiQuery.query('families', null, 'GET');
        }
    }
</script>
