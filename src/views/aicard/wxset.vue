<template>
  <div class="app-container">
    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
      <el-form-item label="appid" prop="appid" >
        <el-input v-model="pushData.appid" type="text" clearable @keyup.enter.native="handleCreateSave"></el-input>
      </el-form-item>
      <el-form-item label="secret" prop="secret" >
        <el-input v-model="pushData.secret" type="text" clearable @keyup.enter.native="handleCreateSave"></el-input>
      </el-form-item>
      <el-form-item style="margin-top:30px;">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { infoData, saveData } from "@/api/centerUserWxKey";

export default {
  data() {
    return {
      rules: {
        appid: [
          { required: true, message: '不能为空'}
        ],
        secret: [
          { required: true, message: '不能为空'}
        ]
      },

      pushData: {
        id: undefined,
        appid: undefined,
        secret: undefined
      }
    }
  },
  mounted() {
    infoData().then(res => {
      if (res.code == 0) {
        this.pushData.appid = res.data.appid
        this.pushData.secret = res.data.secret
      }
    }).catch(e=>{
      console.error(e);
    })
  },
  methods: {
    onSubmit() {
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          saveData(this.pushData).then(res => {
            if (res.code == 101) {
              this.$message.error('appid或secret不正确！');
            }
            if (res.code == 0) {
              this.pushData.dialogFormVisible = false;
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1 * 1000
              });
            } else {
              this.$message({
                message: res.msg,
                type: "error",
                duration: 3 * 1000
              });
            }
          })
          .catch(e => {
            console.error(e);
          });
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

