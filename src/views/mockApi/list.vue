<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        size="medium"
        style="margin-left: 10px;"
        type="danger"
        icon="el-icon-plus"
        @click="addGroup">
        添加分组
      </el-button>
      <el-button
        class="filter-item"
        size="medium"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-plus"
        @click="handleCreate">
        添加接口
      </el-button>
    </div>
    <div v-for="group in list" :key="group.id">
      <el-divider>
        {{ group.name }} {{ group.url }}&nbsp;
        <el-button type="text" @click="editGroup(group)" style="color:red">[编辑]</el-button>
        <el-button type="text" @click="delMockGroup(group.id)" style="color:red">[删除]</el-button>
      </el-divider>
      <el-table :data="group.apis" fit highlight-current-row empty-text="暂无接口">
        <el-table-column prop="method" label="请求方式" width="160" />
        <el-table-column label="接口名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
            <el-popover
              v-if="scope.row.describe"
              placement="top-start"
              title="接口介绍"
              width="200"
              trigger="hover"
              :content="scope.row.describe">
              <i slot="reference" class="el-icon-info"></i>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="接口地址">
          <template slot-scope="scope">            
            https://api.it120.cc/{{centerUserBase.domain}}/mock/<font style="color:red;">{{ scope.row.groupUrl }}</font>/<font style="color:blue;">{{ scope.row.url }}</font>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
            <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="设置分组" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="addEditPopForm" :rules="rules" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="分组名称" prop="name" >
          <el-col :span="8">
            <el-input v-model="pushData.name" clearable @keyup.enter.native="handleCreateSave" />
          </el-col>
          <el-col :span="16">&nbsp;&nbsp;取一个易懂的分组名字吧</el-col>
        </el-form-item>
        <el-form-item label="分组路径" prop="url" >
          <el-col :span="8">
            <el-input v-model="pushData.url" clearable @keyup.enter.native="handleCreateSave" />
          </el-col>
          <el-col :span="16">&nbsp;&nbsp;同一个分组的接口，拥有一样的接口地址前缀，如: /abccba/</el-col>          
        </el-form-item>
        <el-alert title="例如 https://api.xxxx.com/cms/api1 这个接口地址，分组路径填 cms" type="warning" :closable="false" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mockApiList, saveMockGroup, delMockGroup, delMockApi } from '@/api/mockApi'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      dialogFormVisible: false,
      list: null,

      rules: {
        name: [
          { required: true, message: '不能为空' }
        ],
        url: [
          { required: true, message: '不能为空' }
        ]
      },

      pushData: {
        id: undefined,
        name: undefined,
        url: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
  },
  activated() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const loadingInstance = this.$loading({
        text: 'Loading...'
      })
      mockApiList().then(response => {
        if (response.code === 0) {
          this.list = response.data
        } else {
          this.list = null
        }
      }).finally(() => {
        loadingInstance.close()
      })
    },
    addGroup() {
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleCreateSave() {
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          saveMockGroup(this.pushData).then((res) => {
            this.dialogFormVisible = false
            if (res.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.fetchData()
            } else {
              this.$message.error(res.msg)
            }
          }).catch(e => {
            console.error(e)
          })
        }
      })
    },
    editGroup(obj) {
      this.pushData = Object.assign({}, this.pushDataTmp, obj)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleCreate() {
      this.$router.push({ path: 'add' })
    },
    handleUpdate(id) {
      this.$router.push({ path: 'add', query: { id: id }})
    },
    delMockGroup(id) {
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMockGroup(id).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {})
    },
    delData(id) {
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMockApi(id).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error(res.msg)
          }
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
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
