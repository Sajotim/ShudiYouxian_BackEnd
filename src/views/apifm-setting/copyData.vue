<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="将我的数据克隆给别人">
        <div class="tipBox">
          <p class="title">注意事项:</p>
          <div class="itemList">
            <p>1、将本后台数据克隆到输入的账号，使得输入的账号登陆后将看到和本后台一样的数据</p>
            <p>2、本操作会删除输入账号的原有数据，请谨慎操作</p>
            <p>&nbsp;</p>
          </div>
        </div>
        <el-form :rules="rules" ref="addEditPopFormA" :model="pushData" label-width="120px">
          <el-form-item label="用户名" prop="mobile" >
            <el-col :span="12">
              <el-input v-model="pushData.mobile" clearable></el-input>
            </el-col>
            <el-col :span="11" :offset="1" style="color:red;">
              通常为手机号码
            </el-col>
          </el-form-item>
          <el-form-item label="密码" prop="pwd" >
            <el-col :span="12">
              <el-input v-model="pushData.pwd" clearable></el-input>
            </el-col>
            <el-col :span="11" :offset="1" style="color:red;">
              请正确输入，错误次数太多账号有可能会被系统锁定
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="onSubmitA"> 「 立即克隆 」 </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="将别人的数据克隆给我">
        <div class="tipBox">
          <p class="title">注意事项:</p>
          <div class="itemList">
            <p>1、当前后台数据将会被删除；</p>
            <p>2、对方商户后台数据将会克隆到当前后台；</p>
            <p>&nbsp;</p>
          </div>
        </div>
        <el-form :rules="rules" ref="addEditPopFormB" :model="pushData" label-width="120px">
          <el-form-item label="对方商户ID" prop="merchantId" >
            <el-col :span="12">
              <el-input v-model="pushData.merchantId" clearable @keyup.enter.native="handleCreateSave"></el-input>
            </el-col>
            <el-col :span="11" :offset="1" style="color:red;">
              请向对方索要
            </el-col>
          </el-form-item>          
          <el-form-item>
            <el-button type="danger" @click="onSubmitB"> 「 立即克隆 」 </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { typeA, typeB } from '@/api/copyData'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      rules: {
        mobile: [
          { required: true, message: '不能为空'}
        ],
        pwd: [
          { required: true, message: '不能为空'},
        ],
        merchantId: [
          { required: true, message: '不能为空'},
        ],
      },

      pushData: {
        merchantId: undefined,
        mobile: undefined,
        pwd: undefined
      },

    }
  },
  methods: {
    onSubmitA() {
      this.$refs['addEditPopFormA'].validate((valid) => {
        if (valid) {
          typeA(this.pushData).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '克隆成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.pushData = {}
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
    onSubmitB() {
      this.$refs['addEditPopFormB'].validate((valid) => {
        if (valid) {
          typeB(this.pushData.merchantId).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '克隆成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.pushData = {}
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
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.tipBox{
  margin-left:80px;
  .title{
    font-size:15px;
    font-weight:600;
    color:red;
  }
  .itemList{
    line-height: 16px;
    color:#666;
    font-size: 14px;
  }
}
</style>
