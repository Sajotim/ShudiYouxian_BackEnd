<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="投票ID" v-model="searchData.id">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="项目ID" v-model="searchData.voteId">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户编号" v-model="searchData.uid">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="searchData.mobile">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="昵称" v-model="searchData.nick">
      </el-input>
      <el-date-picker type="date" placeholder="投票时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="投票时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" prop="title" />
      <el-table-column label="用户手机/昵称">
        <template slot-scope="scope">
          {{scope.row.mobile ? scope.row.mobile : '-'}}
          <br>
          {{scope.row.nick ? scope.row.nick : '-'}}
          <font v-if="scope.row.teamName">[{{ scope.row.teamName }}]</font>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.items }}
          <el-tooltip v-if="scope.row.remark" class="item" effect="dark" :content="scope.row.remark" placement="top-start">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="投票时间" width="160">
        <template slot-scope="scope">
         {{scope.row.dateAdd}}
        </template>
      </el-table-column>      
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color:blue" @click="infoData(scope.row.id)">详情</el-button>
          <el-button v-if="scope.row.status == 0" type="text" style="color:green" @click="successData(scope.row.id)">报名成功</el-button>
          <el-button v-if="scope.row.status == 0" type="text" style="color:red" @click="delData(scope.row.id)">删除</el-button>
          <el-button v-if="scope.row.status == 1" type="text" style="color:red" @click="cancelData(scope.row.id, scope.row.amount)">取消预约</el-button>
          <el-button v-if="scope.row.status == 1" type="text" style="color:green" @click="serveredData(scope.row.id)">已服务</el-button>
        </template>
      </el-table-column> -->
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

    <el-dialog title="预约详情" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-position="left" label-width="100px">
        <el-form-item label="预约项目ID" >
          {{ pushData.yuyueId }}
        </el-form-item>
        <el-form-item label="用户编号" >
          {{ pushData.uid }}
        </el-form-item>
        <el-form-item label="报名费" >
          {{ pushData.amount }} 元
        </el-form-item>
        <el-form-item v-if="pushData.amount > 0" label="支付单号" >
          {{ pushData.payNumber }}
        </el-form-item>
        <el-form-item label="备注" >
          {{ pushData.remark }}
        </el-form-item>
        <el-form-item v-for="kv in kvList" v-bind:key="kv.k" :label="kv.k" >
          {{ kv.v }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pushData.dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { voteJoinList } from '@/api/voteInfo'
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

      kvList:[],

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
      voteJoinList(this.page, this.pageSize, this.searchData).then(response => {
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
            if (ele.voteId) {
              let voteMap = response.data.voteMap[ele.voteId]
              if (voteMap) {
                ele.title = voteMap.title
              }
            }            
          })
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    infoData(id){
      infoData(id).then(res => {
        if (res.code != 0) {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.pushData = Object.assign({}, this.pushDataTmp, res.data.info)
          // 计算扩展属性
          let kvList = [];
          if (res.data.extJson) {
            Object.keys(res.data.extJson).forEach(k => {
              let aaaa = '{"k":"'+ k +'", "v":"'+ res.data.extJson[k] +'"}'
              kvList.push(JSON.parse(aaaa))
            })
          }
          this.kvList = kvList
          this.pushData.dialogFormVisible = true
        }
      }).catch(e=>{
        console.error(e);
      })
    },
    successData(id){
      this.$confirm('请确保本次预约/报名用户已成功付款，您已确认收到用户款项! ', '提示', {
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
    },
    serveredData(id){
      this.$confirm('本次预约已服务，该记录标记为已服务! ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        serveredData(id).then(res => {
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
    cancelData(id, amount){
      this.$confirm('确定要取消本次预约吗？您将可以选择是否退还报名费! ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (amount == 0) {
          cancelData(id, false).then(res => {
            Message({
              message: '取消成功',
              type: 'success',
              duration: 1 * 1000
            })
            this.fetchData()
          })
        } else {
          this.$confirm('是否需要退还报名费! ', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            cancelData(id, true).then(res => {
              Message({
                message: '取消成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.fetchData()
            })
          }).catch(() => {
            cancelData(id, false).then(res => {
              Message({
                message: '取消成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.fetchData()
            })
          });
        }
      }).catch(() => {});
    },
    delData(id){
      this.$confirm('确定要删除吗？ ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData(id).then(res => {
          Message({
            message: '删除成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
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
