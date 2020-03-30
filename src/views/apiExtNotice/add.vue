<template>
  <div class="app-container">
    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-width="120px">
      <el-form-item label="类型" prop="type">
        <el-input v-model="pushData.type" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否显示" prop="isShow">
        <el-select v-model="pushData.isShow">
          <el-option label="展示" value="true"></el-option>
          <el-option label="隐藏" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="pushData.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="跳转地址" prop="redirectUrl">
        <el-col :span="5">
          <el-input v-model="pushData.redirectUrl" clearable></el-input>
        </el-col>
        <el-col :span="19" style="color:red">
          &nbsp;&nbsp;适合做一句话公告，点击公告标题做跳转
        </el-col>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <Tinymce :height=500 ref="editor" v-model="pushData.content"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { saveData, infoData } from '@/api/apiExtNotice'
import { Message, MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'
import Tinymce from '@/components/Tinymce'

let vm

export default {
  data() {
    return {

      imageUrl:undefined,
      uploadUrl:process.env.VUE_APP_BASE_API + '/fileUpload',
      uploadUrlHeaders:{
        "X-Token":getToken()
      },

      kvList:[
        {k:"", v:""}
      ],

      rules: {
        title: [
          { required: true, message: '不能为空'}
        ],
        isShow: [
          { required: true, message: '不能为空'},
        ],
        content: [
          { required: true, message: '不能为空'}
        ],
      },

      pushData: {
        id:undefined,
        paixu:0,
        isShow:'true',
        status:'2',
      },

      dialogTitle : undefined,
      dialogFormVisible:false,

      extJson:{},

    }
  },
  components: {
    Tinymce
  },
  mounted() {
    vm = this
    if (this.$route.query.id) {
      infoData(this.$route.query.id).then(res => {
        if (res.code != 0) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
          this.$router.push({ path: '/user/apiExtNotice/list' })
        } else {
          vm.pushData = Object.assign({}, res.data, {isShow: '' + res.data.isShow})          
        }
      }).catch(e=>{
        console.error(e);
      })
    }
  },
  methods: {
    onSubmit() {
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
              this.$router.push({ path: '/user/apiExtNotice/list' })
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
    onCancel() {
      this.$router.back();
    },
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

