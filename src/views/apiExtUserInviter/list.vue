<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="邀请用户编号" v-model="searchData.uidm" />
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="注册用户编号" v-model="searchData.uids" />
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.isUse" placeholder="是否启用">
        <el-option label="启用" value="true"></el-option>
        <el-option label="禁用" value="false"></el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.level" placeholder="发展关系">
        <el-option label="1级" value="1"></el-option>
        <el-option label="2级" value="2"></el-option>
        <el-option label="3级" value="3"></el-option>
      </el-select>
      <el-date-picker type="date" placeholder="注册时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="注册时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button class="filter-item" size="medium" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-edit">添加</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="邀请用户">
        <template slot-scope="scope">
          {{ scope.row.nickM ? scope.row.nickM : '-' }}<br>
          {{ scope.row.mobileM ? scope.row.mobileM : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="注册用户">
        <template slot-scope="scope">
          {{ scope.row.nickS ? scope.row.nickS : '-' }}<br>
          {{ scope.row.mobileS ? scope.row.mobileS : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="发展关系">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.level == 1">1级</el-tag>
          <el-tag type="warning" v-if="scope.row.level == 2">2级</el-tag>
          <el-tag type="info" v-if="scope.row.level == 3">3级</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isUse">启用</el-tag>
          <el-tag type="danger" v-if="!scope.row.isUse">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="添加/修改" width="160">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}<br>{{scope.row.dateUpdate?scope.row.dateUpdate:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
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

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="140px">
        <el-form-item label="邀请用户编号" prop="uidm" >
          <el-input v-model="pushData.uidm" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="注册用户编号" prop="uids" >
          <el-input v-model="pushData.uids" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="关系" prop="level" >
          <el-select v-model="pushData.level" placeholder="请选择">
            <el-option label="1级" :value="1"></el-option>
            <el-option label="2级" :value="2"></el-option>
            <el-option label="3级" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="isUse" >
          <el-select v-model="pushData.isUse" placeholder="请选择">
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, delData, saveData } from '@/api/apiExtUserInviter'
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
        uidm: [
          { required: true, message: '不能为空'},
        ],
        uids: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{},

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        level:1,
        isUse:true
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      statisticsData:{}
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
      fetchList(this.page, this.pageSize, this.searchData).then(response => {
        if (response.code == 0) {
          this.list = response.data.result
          this.list.forEach(ele => {
            let userMapM = response.data.userMapM[ele.uidm]
            if (userMapM) {
              ele.nickM = userMapM.nick
              ele.mobileM = userMapM.mobile
            }
            let userMapS = response.data.userMapS[ele.uids]
            if (userMapS) {
              ele.nickS = userMapS.nick
              ele.mobileS = userMapS.mobile
            }
          })          
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '增加用户关系'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdate(r){
      this.pushData = Object.assign({}, this.pushDataTmp, r)
      this.pushData.dialogTitle = '修改用户关系'
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
    statistics(){
      statistics().then(res => {
        // 弹框点击确定调整支付宝付款
        this.statisticsData = res.data
      })
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
