<template>
  <div>
    <div class="card">
      <div class="card-header">Families panel</div>
      <div class="card-body">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="grid-content bg-purple edit-bttn text-right">
              <el-button type="success">Add
                <i class="el-icon-plus el-icon-right"></i>
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <table-data-list :table-data-obj="tableData"></table-data-list>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  import tableDataList from '@/components/tables/tableDataList.vue';

  export default {
    name: 'familiesPage',
    components: {
      tableDataList
    },
    data() {
      return {
        //api url adress
        apiUrl: this.$store.state.api,
        //data list
        tableData: [{
          date: '2016-05-03',
          name: 'Tom',
        }, {
          date: '2016-05-02',
          name: 'Tom',
        }, {
          date: '2016-05-04',
          name: 'Tom',
        }, {
          date: '2016-05-01',
          name: 'Tom',
        }]
      }
    },
    methods: {
      axiosApiRequest(_method, _data = null, _target){
        this.axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        this.axios({
                    method: _method,
                    data: _data,
                    url: this.apiUrl + 'insect/' + _target
                }).then(response => {
                    this.tableData = this.reverseItems(response.data);
                }).catch(error => {
                  // if(error){
                  //   this.error.message = error;
                  // }
                });
      }
    },
    mounted() {
      this.axiosApiRequest('get', null, 'families');
    }
  }
</script>
<style>
  .edit-bttn > * {
    font-size: 18px;
    text-decoration: none;
  }
</style>
