<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="类型" v-model="searchData.type">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="对象编号" v-model="searchData.refId">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="名称" v-model="searchData.name">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="正常" value="0"></el-option>
        <el-option label="失效" value="1"></el-option>
        <el-option label="已过期/结束" value="2"></el-option>
      </el-select>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button size="medium" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-edit">添加</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="优惠券信息">
        <template slot-scope="scope">
          编号:{{scope.row.id}}<br>
          类型:{{scope.row.type?scope.row.type:'-'}}<br>
          对象:{{scope.row.refId?scope.row.refId:'-'}}<br>
          名称:{{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="领取条件">
        <template slot-scope="scope">
          需要口令:{{scope.row.pwd?scope.row.pwd:'无'}}<br>
          消耗{{scope.row.needScore}} 积分<br>
          连续签到{{scope.row.needSignedContinuous}}天
        </template>
      </el-table-column>
      <el-table-column label="使用限制">
        <template slot-scope="scope">
          每人限领 {{scope.row.numberPersonMax}} 张
          <br>
          消费满 {{scope.row.moneyHreshold}} 元可用
        </template>
      </el-table-column>
      <el-table-column label="优惠券数量">
        <template slot-scope="scope">
          总数:{{scope.row.numberTotle}}<br>
          剩余:{{scope.row.numberLeft}}<br>
          已有{{scope.row.numberGitNumber}}人领取了{{scope.row.numberGit}}<br>
          已使用:{{scope.row.numberUsed}}
        </template>
      </el-table-column>      
      <el-table-column label="金额（元）">
        <template slot-scope="scope">
          <span v-if="scope.row.moneyMin == scope.row.moneyMax">{{scope.row.moneyMin}}</span>
          <span v-else>{{scope.row.moneyMin}} ~ {{scope.row.moneyMax}} 随机</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 0">正常</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 1">失效</el-tag>
          <el-tag type="info" v-if="scope.row.status == 2">已过期/结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="有效期">
        <template slot-scope="scope">
          <span v-if="scope.row.dateStartType == 0">{{scope.row.dateStart}}生效</span>
          <span v-if="scope.row.dateStartType == 1">领取当天生效</span>
          <span v-if="scope.row.dateStartType == 2">领取次日生效</span>
          <br>
          <span v-if="scope.row.dateEndType == 0">{{scope.row.dateEnd}}截止</span>
          <span v-if="scope.row.dateEndType == 1">领取{{scope.row.dateEndDays}}天后到期</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%" align="center">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><el-button type="text" @click="sendUser(scope.row.id)" style="color:green">发放给用户</el-button></el-dropdown-item>
              <el-dropdown-item><el-button type="text" @click="sendUserLevel(scope.row.id)" style="color:green">发放给指定等级用户</el-button></el-dropdown-item>
              <el-dropdown-item><el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button></el-dropdown-item>
              <el-dropdown-item><el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
import { fetchDataList, delData, sendUser, sendUserLevel } from '@/api/extDiscountsCoupon'
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

      searchData:{},

      multipleSelection: [],
      list: null,
      listLoading: true
    }
  },
  created() {
    
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
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.$router.push({ path: 'add' })
    },
    handleUpdate(id){
      this.$router.push({ path: 'add', query:{id:id} })
    },
    delData(id){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
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
    sendUser(id){
      this.$prompt('请输入用户编号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\d+/,
        inputErrorMessage: '用户编号为数字'
      }).then(({ value }) => {
        sendUser(id, value).then(res => {
          if (res.code == 0) {
            Message({
              message: '赠送成功',
              type: 'success',
              duration: 1 * 1000
            })
          } else {
            Message({
              message: res.msg,
              type: 'error',
              duration: 1 * 1000
            })
          }          
        })
      }).catch(() => {});
    },
    sendUserLevel(id){
      this.$prompt('请输入用户等级编号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\d+/,
        inputErrorMessage: '用户等级编号为数字'
      }).then(({ value }) => {
        sendUserLevel(id, value).then(res => {
          if (res.code == 0) {
            Message({
              message: '赠送成功',
              type: 'success',
              duration: 1 * 1000
            })
          } else {
            Message({
              message: res.msg,
              type: 'error',
              duration: 1 * 1000
            })
          }          
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
