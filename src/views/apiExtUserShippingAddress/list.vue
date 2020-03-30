<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="searchData.mobileUser">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="昵称" v-model="searchData.nick">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.isDefault" placeholder="是否默认">
        <el-option label="全部" value=""></el-option>
        <el-option label="默认" value="true"></el-option>
        <el-option label="不默认" value="false"></el-option>
      </el-select>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="快递手机号码" v-model="searchData.mobile">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="全部" value=""></el-option>
        <el-option label="正常" value="0"></el-option>
        <el-option label="禁用" value="1"></el-option>
      </el-select>

      <el-date-picker
        v-model="dateAdd"
        type="datetimerange"
        @change="handleDateAdd"
        align="center"
        start-placeholder="添加时间起"
        end-placeholder="添加时间止"
        :default-time="['00:00:00', '23:59:59']"
        :picker-options="pickerOptions">
      </el-date-picker>

      <el-date-picker
        v-model="dateUpdate"
        type="datetimerange"
        @change="handleDateUpdate"
        align="center"
        start-placeholder="更新时间起"
        end-placeholder="更新时间止"
        :default-time="['00:00:00', '23:59:59']"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
   <!-- 编号	手机号码	昵称	是否默认	所在地	联系人	邮编	状态	添加时间	更新时间	操作-->
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column prop="id" label="编号" width="80px"></el-table-column>
      <el-table-column prop="mobileUser" label="手机号码" width="120px" />
      <el-table-column prop="nick" label="昵称" />
      <el-table-column label="是否默认" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.isDefault" class="el-icon-check" style="color:green;"></i>
          <i v-else class="el-icon-close" style="color:red;"></i>
        </template>
      </el-table-column>
      <el-table-column label="所在地">
        <template slot-scope="scope">
          {{scope.row.provinceStr}}{{scope.row.cityStr}}{{scope.row.areaStr}} 
          <br>
          {{scope.row.address}}
        </template>
      </el-table-column>
      <el-table-column prop="city" label="联系人">
        <template slot-scope="scope">
          {{scope.row.linkMan}}
          <br/>
          {{scope.row.mobile}}
          <br/>
          <span v-if="scope.row.idcard">{{scope.row.idcard}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="邮编"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'danger' : 'success'"
            disable-transitions>{{scope.row.statusStr}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="dateAdd" label="添加/更新时间" width="160px">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}
          <br>
          {{scope.row.dateUpdate ? scope.row.dateUpdate : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow" style="margin-top:20px;">
    </el-pagination>
  </div>
</template>

<script>
  import { fetchDataList,delData } from '@/api/apiExtUserShippingAddress'
  import { Message, MessageBox } from 'element-ui'
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'centerUserBase'
      ])
    },
    data() {
      return {
        page:1,
        pageSize:50,
        totalRow:0,

        rules: {},

        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        dateAdd: '',
        dateUpdate: '',
        searchData:{
          isDefault:undefined,
          mobile:undefined,
          nick:undefined,
          mobileUser:undefined,
          status:undefined,
          dateAddBegin:undefined,
          dateAddEnd:undefined,
          dateUpdateBegin:undefined,
          dateUpdateEnd:undefined,
        },

        multipleSelection: [],
        list: null,
        listLoading: true
      }
    },
    created() {
      this.pushDataTmp = Object.assign({}, this.pushData)
    },
    activated() {
      this.fetchData()
    },
    methods: {
      handleDateAdd(val) {
        this.searchData.dateAddBegin = val?val[0]:undefined;
        this.searchData.dateAddEnd = val?val[1]:undefined;
      },
      handleDateUpdate(val) {
        this.searchData.dateUpdateBegin = val?val[0]:undefined;
        this.searchData.dateUpdateEnd = val?val[1]:undefined;
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.page = val
        this.fetchData()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      fetchData() {
        this.list = null
        this.listLoading = true
        fetchDataList(this.page, this.pageSize, this.searchData).then(response => {
          if (response.code === 0) {
            response.data.result.forEach(ele => {
              const apiExtUserMap = response.data.apiExtUserMap[ele.uid]
              if (apiExtUserMap) {
                ele.mobileUser = apiExtUserMap.mobile ? apiExtUserMap.mobile : '-'
                ele.nick = apiExtUserMap.nick ? apiExtUserMap.nick : '-'
              } else {
                ele.mobileUser = '-'
                ele.nick = '-'
              }
            })
            this.list = response.data.result
            this.totalRow = response.data.totalRow
            
          }else if(response.code === 700){
            this.totalRow = 0
          }
          this.listLoading = false
        })
      },
      handleUpdate(id) {
        this.$router.push({path: '/user/apiExtUserShippingAddress/add', query: {id: id}});
      },
      delData(id){
        this.$confirm('删除无法恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delData(id).then(() => {
            Message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            })
            this.fetchData()
          })
        }).catch(() => {});
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .filter-container {
    padding-bottom: 10px;
    .filter-item {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 10px;
    }
  }
  .el-range-editor.el-input__inner {
    padding: 7px 11px;
  }

</style>
