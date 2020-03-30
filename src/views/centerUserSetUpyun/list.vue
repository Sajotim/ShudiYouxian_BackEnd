<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-button class="filter-item" size="medium" @click="handleCreate()" type="success" icon="el-icon-plus">添加</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column prop="bucketName" label="bucketName"></el-table-column>
      <el-table-column prop="userName" label="操作员账号"></el-table-column>
      <el-table-column prop="password" label="操作员密码"></el-table-column>
      <el-table-column prop="domain" label="域名"></el-table-column>
      <el-table-column prop="fold" label="文件夹"></el-table-column>
      <el-table-column label="状态" width="100%">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isUse">启用</el-tag>
          <el-tag type="danger" v-if="!scope.row.isUse">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="180px">
        <el-form-item label="状态" prop="isUse" >
          <el-select v-model="pushData.isUse">
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务名（bucketName）" prop="bucketName">
          <el-input v-model="pushData.bucketName" clearable @keyup.enter.native="handleCreateSave" style="width: 30%;"></el-input>
        </el-form-item>
        <el-form-item label="操作员账号" prop="userName">
          <el-input v-model="pushData.userName" clearable @keyup.enter.native="handleCreateSave" style="width: 30%;"></el-input>
        </el-form-item>
        <el-form-item label="操作员密码" prop="password">
          <el-input v-model="pushData.password" clearable @keyup.enter.native="handleCreateSave" style="width: 30%;"></el-input>
        </el-form-item>
        <el-form-item label="访问域名" prop="domain">
          <el-input v-model="pushData.domain" clearable @keyup.enter.native="handleCreateSave" style="width: 30%;"></el-input>
        </el-form-item>
        <el-form-item label="根目录文件夹">
          <el-input v-model="pushData.fold" clearable @keyup.enter.native="handleCreateSave" style="width: 30%;"></el-input>
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
import { fetchDataList, infoData, delData, saveData } from '@/api/centerUserSetUpyun'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      rules: {
        bucketName: [
          { required: true, message: '不能为空'},
        ],
        userName: [
          { required: true, message: '不能为空'},
        ],
        password: [
          { required: true, message: '不能为空'},
        ],
        domain: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{},

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        isUse: true,
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      statisticsData:{}
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.fetchData()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      fetchDataList().then(response => {
        if (response.code === 0) {
          this.list = response.data
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '添加又拍云设置'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdate(id){
      infoData(id).then(res => {
        if (res.code !== 0) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.pushData = Object.assign({}, this.pushDataTmp, res.data, {dateType:'' + res.data.dateType, isPub:'' + res.data.isPub, content:res.data.value})
          this.pushData.dialogTitle = '修改又拍云设置'
          this.pushData.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['addEditPopForm'].clearValidate()
          })
        }
      }).catch(e=>{
        console.error(e);
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
    delData(id){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData(id).then(res => {
          if (res.code === 0) {
            Message({
              message: '删除成功',
              type: 'success',
              duration: 1 * 1000
            })
            this.fetchData()
          } else {
            Message({
              message: res.msg,
              type: 'error',
              duration: 1 * 1000
            })
          }
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
