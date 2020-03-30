<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户编号" v-model="searchData.uid">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="searchData.mobile">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="待审核" value="0"></el-option>
        <el-option label="不通过" value="1"></el-option>
        <el-option label="通过" value="2"></el-option>
      </el-select>
      <el-date-picker type="date" placeholder="申请时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="申请时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="用户编号" prop="uid" />
      <el-table-column label="昵称/手机">
        <template slot-scope="scope">
          {{scope.row.nickU ? scope.row.nickU : '-'}}
          <br>
          {{scope.row.mobileU ? scope.row.mobileU : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="联系方式">
        <template slot-scope="scope">
          {{scope.row.name ? scope.row.name : '-'}}
          <br>
          {{scope.row.mobile ? scope.row.mobile : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status == 0">待审核</el-tag>
          <el-tag type="success" v-if="scope.row.status == 2">通过</el-tag>
          <el-tag type="danger" v-if="scope.row.status ==1">不通过</el-tag>
          <el-popover
            v-if="scope.row.remark"
            placement="top-start"
            title="备注"
            width="200"
            trigger="hover"
            :content="scope.row.remark">
            <i slot="reference" class="el-icon-info"></i>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="申请/审核时间" width="160">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}
          <br>
          {{scope.row.dateUpdate?scope.row.dateUpdate:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" type="text" style="color:green" @click="successData(scope.row.id)">通过</el-button>
          <el-button v-if="scope.row.status == 0" type="text" style="color:red" @click="refuseData(scope.row.id)">不通过</el-button>
          <el-button type="text" style="color:red" @click="delData(scope.row.id)">删除</el-button>
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
import { fetchDataList, passData, refuseData, delData } from '@/api/saleDistributionApply'
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
      pageSize:10,
      totalRow:0,

      rules: {
        goodReputation: [
          { required: true, message: '不能为空'},
        ],
        goodReputationRemark: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{
        mobile:undefined,
        nick:undefined,
        orderId:undefined,
        orderNumber:undefined,
        goodReputation:undefined,
      },

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        goodReputation:undefined,
        goodReputationRemark:undefined,
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
        if (response.code == 0) {
          this.list = response.data.result
          this.list.forEach(ele => {
            if (ele.uid) {
              let UserMap = response.data.userMap[ele.uid]
              if (UserMap) {
                ele.mobileU = UserMap.mobile
                ele.nickU = UserMap.nick
              }
            }
          })
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    successData(id){
      this.$confirm('已严格审核申请信息，准予开通该用户分销商资格！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        passData(id).then(res => {
          if (res.code != 0) {
            Message({
              message: res.msg,
              type: 'error',
              duration: 3 * 1000
            })
            return
          }
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
    refuseData(id){
      this.$prompt('请填写拒绝理由：', '拒绝本次申请', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        refuseData(id, value).then(res => {
          if (res.code != 0) {
            Message({
              message: res.msg,
              type: 'error',
              duration: 3 * 1000
            })
            return
          }
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
    delData(id){
      this.$confirm('删除本次申请，用户可重新发起申请！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData(id).then(res => {
          if (res.code != 0) {
            Message({
              message: res.msg,
              type: 'error',
              duration: 3 * 1000
            })
            return
          }
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
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

</style>
