<template>
  <div class="app-container">
    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="160px">
      <el-form-item label="名片字段" prop="fields" >
        <el-input v-model="pushData.fields" type="text" clearable @keyup.enter.native="handleCreateSave"></el-input>
      </el-form-item>
      <el-form-item label="默认名片编号" prop="defaultUid" >
        <el-input v-model="pushData.defaultUid" type="text" clearable @keyup.enter.native="handleCreateSave"></el-input>
      </el-form-item>
      <el-form-item label="公司介绍">
        <Tinymce :height=500 ref="editor" v-model="pageContent.content"/>
      </el-form-item>
      <el-form-item style="margin-top:30px;">
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { batchConfigInfos, saveConfig } from '@/api/apiExtConfig'
import { savePageData, pageInfoKeyData } from '@/api/apiExtPage'

import { Message, MessageBox } from 'element-ui'

import Tinymce from '@/components/Tinymce'

let vm

export default {
  data() {
    return {
      configId: undefined,
      configIdFields: undefined,

      rules: {
        fields: [
          { required: true, message: '不能为空'}
        ],
        defaultUid: [
          { required: true, message: '不能为空'}
        ]
      },

      pushData: {
        id:undefined,
        defaultUid: undefined,
        fields: 'QQ,邮箱,微信,职位'
      },
      pageContent: {
        key: '0',
        title: '0',
        content: undefined
      }
    }
  },
  components: {
    Tinymce
  },
  mounted() {
    vm = this
    batchConfigInfos('user.ext.fileds').then(res => {
      if (res.code == 700) {
        saveConfig({
          dateType: 0,
          key: 'user.ext.fileds',
          content: vm.pushData.fields,
          remark: '名片字段，多个字段用英文逗号分隔',
        })
      }  
      if (res.code == 0) {
        vm.configIdFields = res.data[0].id
        vm.pushData.fields = res.data[0].value
      }  
    })
    batchConfigInfos('ALLOW_VIEW_FRIEND').then(res => {
      if (res.code == 700) {
        saveConfig({
          dateType: 0,
          key: 'ALLOW_VIEW_FRIEND',
          content: '1',
          remark: '允许查看好友信息',
        })
      }  
    })
    batchConfigInfos('DEFAULT_FRIEND_UID').then(res => {
      vm.listLoading = false
      if (res.code == 0) {
        vm.configId = res.data[0].id
        vm.pushData.defaultUid = res.data[0].value
      }  
    })
    pageInfoKeyData(0).then(res => {
      if (res.code == 0) {
        vm.pageContent = res.data
      }
    }).catch(e=>{
      console.error(e);
    })
  },
  methods: {
    onSubmit() {
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          saveConfig({
            id: vm.configId,
            key: 'DEFAULT_FRIEND_UID',
            content: vm.pushData.defaultUid
          }).then((res) => {
            if (res.code == 0) {
              Message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000
              })
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
          saveConfig({
            id: vm.configIdFields,
            key: 'user.ext.fileds',
            content: vm.pushData.fields
          }).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000
              })
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
          savePageData(this.pageContent).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code != 0) {
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

