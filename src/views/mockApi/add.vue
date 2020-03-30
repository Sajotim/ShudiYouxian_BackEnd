<template>
  <div class="app-container">
    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-width="120px">
      <el-form-item label="所属分组" prop="groupId">
        <el-select clearable v-model="pushData.groupId" placeholder="请选择">
          <el-option v-for="item in groups" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接口名称" prop="name">
        <el-col :span="8">
          <el-input v-model="pushData.name" clearable />
        </el-col>
        <el-col :span="16">&nbsp;&nbsp;一句话讲清楚这个接口是做什么的</el-col>
      </el-form-item>
      <el-form-item label="接口路径" prop="url">
        <el-col :span="8">
          <el-input v-model="pushData.url" clearable />
        </el-col>
        <el-col :span="16" style="color:red;">&nbsp;&nbsp;例如 https://api.xxxx.com/cms/api1 这个接口地址，接口路径填 api1</el-col>
      </el-form-item>
      <el-form-item label="请求方式" prop="method">
        <el-radio v-model="pushData.method" label="get">get</el-radio>
        <el-radio v-model="pushData.method" label="post">post</el-radio>
        <el-radio v-model="pushData.method" label="put">put</el-radio>
        <el-radio v-model="pushData.method" label="delete">delete</el-radio>
      </el-form-item>
      <el-form-item label="接口介绍" prop="describe">
        <el-input v-model="pushData.describe" type="textarea" :rows="4" clearable></el-input>
      </el-form-item>
      <el-form-item label="接口返回" prop="content">
        <el-input v-model="pushData.content" type="textarea" :rows="20" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { mockApiList, mockApiInfo, saveMockApi } from '@/api/mockApi'

export default {
  data() {
    return {
      groups: [],
      rules: {
        groupId: [
          { required: true, message: '不能为空' }
        ],
        name: [
          { required: true, message: '不能为空' }
        ],
        url: [
          { required: true, message: '不能为空' }
        ],
        method: [
          { required: true, message: '不能为空' }
        ],
        content: [
          { required: true, message: '不能为空' }
        ]
      },

      pushData: {
        id: undefined,
        groupId: undefined,
        name: undefined,
        url: undefined,
        method: 'get',
        describe: undefined
      }
    }
  },
  mounted() {
    mockApiList().then(res => {
      if (res.code === 0) {
        this.groups = res.data
      }
    })
    if (this.$route.query.id) {
      mockApiInfo(this.$route.query.id).then(res => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
          this.$router.push({ path: '/user/mockApi/list' })
        } else {
          this.pushData = Object.assign({}, res.data)
        }
      }).catch(e => {
        console.error(e)
      })
    }
  },
  methods: {
    onSubmit() {
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          saveMockApi(this.pushData).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.$router.push({ path: '/user/mockApi/list' })
            } else {
              this.$message.error(res.msg)
            }
          }).catch(e => {
            console.error(e)
          })
        }
      })
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
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

