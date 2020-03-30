<template>
  <div class="app-container">    
    <div class="filter-container">
      <el-button class="filter-item" size="medium" type="success" icon="el-icon-plus" @click="handleCreate">添加</el-button>
    </div>
    <el-alert
      title="您可以配置自己的云存储，配置自己的云存储后将不占用当前后台的存储空间"
      type="warning"
      effect="dark"
      :closable="false">
    </el-alert>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column prop="typeStr" label="类型"></el-table-column>
      <el-table-column prop="domain" label="加速域名"></el-table-column>
      <el-table-column prop="bucket" label="空间名"></el-table-column>      
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isDefault">启用</el-tag>
          <el-tag type="danger" v-if="!scope.row.isDefault">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="添加/更新时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.dateAdd }}<br>{{ scope.row.dateUpdate?scope.row.dateUpdate:'-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.isDefault" type="text" @click="enableDfsConfig(scope.row.id)" style="color:red">启用该配置</el-button>
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="类型" prop="type" >
          <el-select v-model="pushData.type" placeholder="请选择">
            <el-option label="七牛云" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加速域名" prop="domain">
          <el-col :span="10">
            <el-input v-model="pushData.domain" clearable placeholder="例如: http://q5bgc0bga.bkt.clouddn.com" @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="14">&nbsp;&nbsp;&nbsp;访问你的云储存上文件的域名</el-col>
        </el-form-item>
        <el-form-item label="空间名" prop="bucket">
          <el-col :span="10">
            <el-input v-model="pushData.bucket" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="14">&nbsp;&nbsp;&nbsp;云存储空间名</el-col>
        </el-form-item>
        <el-form-item v-if="pushData.type == 0" label="AccessKey" prop="userName">
          <el-col :span="10">
            <el-input v-model="pushData.userName" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="14">&nbsp;&nbsp;&nbsp;“密钥管理”中的AccessKey</el-col>
        </el-form-item>
        <el-form-item v-if="pushData.type == 0" label="SecretKey" prop="password">
          <el-col :span="10">
            <el-input v-model="pushData.password" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="14">&nbsp;&nbsp;&nbsp;“密钥管理”中的SecretKey</el-col>
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
import { fetchDataList, infoData, delData, saveData, enableDfsConfig } from '@/api/dfsConfig'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  data() {
    return {
      rules: {
        type: [
          { required: true, message: '不能为空' }
        ],
        bucket: [
          { required: true, message: '不能为空' }
        ],
        domain: [
          { required: true, message: '不能为空' }
        ],
        userName: [
          { required: true, message: '不能为空' }
        ],
        password: [
          { required: true, message: '不能为空' }
        ]
      },

      searchData: {},

      pushData: {
        dialogTitle: undefined,
        dialogFormVisible: false,

        id: undefined,
        type: 0,
        bucket: undefined,
        port: undefined,
        userName: undefined,
        password: undefined,
        from: undefined,
        isUse: true,
        isSsl: true,
        weight: 10
      },

      multipleSelection: [],
      list: null,
      listLoading: true
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.fetchData()
  },
  mounted() {

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
    handleCreate() {
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '自定义云存储设置'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdate(id) {
      infoData(id).then(res => {
        if (res.code != 0) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.pushData = Object.assign({}, this.pushDataTmp, res.data)
          this.pushData.dialogTitle = '自定义云存储设置'
          this.pushData.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['addEditPopForm'].clearValidate()
          })
        }
      }).catch(e=>{
        console.error(e);
      })
    },
    handleCreateSave() {
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
    delData(id) {
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData(id).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {})
    },
    enableDfsConfig(id) {
      this.$confirm('确定要启动当前配置吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        enableDfsConfig(id).then(res => {
          this.$message({
            message: '启用成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {})
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
