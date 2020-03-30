<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="searchData.mobileUser">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="昵称" v-model="searchData.nick">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.type" placeholder="类型">
        <el-option label="注册" value="0" />
        <el-option label="邀请好友" value="1" />
        <el-option label="每日签到" value="2" />
        <el-option label="兑换优惠券" value="3" />
        <el-option label="管理员调整" value="4" />
        <el-option label="充值送" value="5" />
        <el-option label="消费返" value="6" />
        <el-option label="好评送积分" value="7" />
        <el-option label="购买商品" value="11" />
        <el-option label="积分券" value="12" />
        <el-option label="分销返佣" value="13" />
        <el-option label="小程序转发微信群" value="14" />
        <el-option label="兑换成长值" value="15" />
        <el-option label="兑换成金额" value="16" />
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.behavior" placeholder="收入/支出">
        <el-option label="收入" value="0" />
        <el-option label="支出" value="1" />
      </el-select>
      <el-date-picker type="date" placeholder="交易时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="交易时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
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
      <el-table-column label="类型" prop="typeStr" />        
      <el-table-column prop="statusStr" label="收入/支出" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.behavior == 0">收入</el-tag>
          <el-tag type="danger" v-if="scope.row.behavior == 1">支出</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="变动积分" prop="score" />
      <el-table-column label="剩余积分" prop="scoreLeft" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="发生时间" prop="dateAdd" width="160" />
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
import { fetchDataList } from '@/api/apiExtUserScoreLog'
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
      this.$confirm('请确保本次支付用户已成功付款，您已确认收到用户款项!  设为成功后，用户余额将实时增加相应的可用余额！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        successData(id).then(res => {
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
