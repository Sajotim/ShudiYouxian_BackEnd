<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="searchData.mobileUser">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户ID" v-model="searchData.uid">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="昵称" v-model="searchData.nick">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="提现编号" v-model="searchData.number">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="待处理" value="0"></el-option>
        <el-option label="成功" value="1"></el-option>
        <el-option label="失败" value="2"></el-option>
        <el-option label="银行处理中" value="3"></el-option>
      </el-select>
      <el-date-picker type="date" placeholder="申请时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="申请时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="更新时间起" v-model="searchData.dateUpdateBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="更新时间止" v-model="searchData.dateUpdateEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="手机/昵称">
        <template slot-scope="scope">
          {{scope.row.mobile ? scope.row.mobile : '-'}}
          <br>
          {{scope.row.nick ? scope.row.nick : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="提现编号" prop="number" />
      <el-table-column label="金额/手续费">
        <template slot-scope="scope">
         {{scope.row.money}}<br>
         {{scope.row.moneyFee}}
        </template>
      </el-table-column> 
      <el-table-column prop="statusStr" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status == 0">待处理</el-tag>
          <el-tag type="success" v-if="scope.row.status == 1">成功</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 2">失败</el-tag>
          <el-tag type="warning" v-if="scope.row.status == 3">银行处理中</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提现/更新时间" width="160">
        <template slot-scope="scope">
         {{scope.row.dateAdd}}<br>
         {{scope.row.dateUpdate?scope.row.dateUpdate:'-'}}
        </template>
      </el-table-column>      
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0 || scope.row.status == 3" type="text" style="color:green" @click="successData(scope.row.id)">成功</el-button>
          <el-button v-if="scope.row.status == 0 || scope.row.status == 3" type="text" style="color:red" @click="refuseData(scope.row.id)">驳回</el-button>
          <el-button v-if="scope.row.status == 0" type="text" style="color:red" @click="payWx(scope.row.id)">微信打款</el-button>
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
import { fetchDataList, infoData, successData, refuseData, payWx } from '@/api/extUserWithdraw'
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
      listLoading: true,
      apiExtUserMap:undefined
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.fetchData()
  },
  mounted() {
    
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
                ele.mobile = UserMap.mobile
                ele.nick = UserMap.nick
              }
            }            
          })
          this.apiExtUserMap = response.data.apiExtUserMap
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '增加评价'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdate(id, goodReputation, goodReputationRemark){
      this.pushData = Object.assign({}, this.pushDataTmp, {id:id, goodReputation:'' + goodReputation, goodReputationRemark:goodReputationRemark})
      this.pushData.dialogTitle = '修改评价'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleCreateSave(){
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          saveData(this.pushData).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.fetchData()
            } else {
              Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000
              })
            }
          }).catch(e=>{
            console.error(e);
          })
        }
      })
    },
    successData(id){
      this.$confirm('请确保已经手动转账给用户，设为成功后，冻结的提现金额将被扣除！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        successData(id).then(res => {
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
      this.$confirm('驳回后，冻结的提现金额将返还给用户，用户可重新发起提现申请！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        refuseData(id).then(res => {
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
    payWx(id){
      this.$confirm('自动打款到用户微信账号，同时设置提现为成功！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        payWx(id).then(res => {
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
