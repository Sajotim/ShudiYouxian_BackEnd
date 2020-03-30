<template>

  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" style="margin-bottom: 10px;margin-left: 10px;" size="small" @click="handleCreate" type="success" icon="el-icon-edit">配置 Appid / Secret</el-button>
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-picture-outline" @click="fetchQrcode">获取小程序二维码</el-button>
      <el-button class="filter-item" style="margin-bottom: 10px;" size="small" @click="delData" type="danger" icon="el-icon-delete">删除当前配置</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" :show-header="false" fit highlight-current-row empty-text="暂无数据">
      <el-table-column prop="name" label="name"></el-table-column>
      <el-table-column prop="val" label="val"></el-table-column>
    </el-table>
    <h3>Accesstoken 信息</h3>
    <el-table :data="listResult" v-loading="listLoading" element-loading-text="Loading" :show-header="false" fit highlight-current-row empty-text="暂无数据">
      <el-table-column prop="name" label="name"></el-table-column>
      <el-table-column prop="val" label="val"></el-table-column>
    </el-table>

    <el-dialog title="配置头条/抖音小程序" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="addEditPopForm" :rules="rules" :model="pushData" label-position="left" label-width="160px">
        <el-divider>小程序配置</el-divider>
        <el-form-item label="AppID" prop="appid">
          <el-col :span="8">
            <el-input v-model="pushData.appid" type="text" clearable @keyup.enter.native="handleCreateSave" />
          </el-col>
          <el-col :span="16">&nbsp;&nbsp;填写小程序开发者平台左侧菜单“开发”处的AppID</el-col>
        </el-form-item>
        <el-form-item label="AppSecret" prop="secret" >
          <el-col :span="8">
            <el-input v-model="pushData.secret" type="text" clearable @keyup.enter.native="handleCreateSave" />
          </el-col>
          <el-col :span="16">&nbsp;&nbsp;填写小程序开发者平台左侧菜单“开发”处的AppSecret</el-col>
        </el-form-item>
        <el-divider>支付配置</el-divider>
        <el-form-item label="商户号" prop="payMerchantId" >
          <el-col :span="8">
            <el-input v-model="pushData.payMerchantId" type="text" clearable @keyup.enter.native="handleCreateSave" />
          </el-col>
          <el-col :span="16">&nbsp;&nbsp;填写小程序开发者平台左侧菜单“支付”处的商户号</el-col>
        </el-form-item>
        <el-form-item label="App ID" prop="payAppId" >
          <el-col :span="8">
            <el-input v-model="pushData.payAppId" type="text" clearable @keyup.enter.native="handleCreateSave" />
          </el-col>
          <el-col :span="16">&nbsp;&nbsp;填写小程序开发者平台左侧菜单“支付”处的App ID</el-col>
        </el-form-item>
        <el-form-item label="支付secret" prop="paySecret" >
          <el-col :span="8">
            <el-input v-model="pushData.paySecret" type="text" clearable @keyup.enter.native="handleCreateSave" />
          </el-col>
          <el-col :span="16">&nbsp;&nbsp;填写小程序开发者平台左侧菜单“支付”处的支付secret</el-col>
        </el-form-item>
        <el-form-item label="支付宝支付" prop="openAlipay" >
          <el-col :span="8">
            <el-radio v-model="pushData.openAlipay" :label="true">开启</el-radio>
            <el-radio v-model="pushData.openAlipay" :label="false">关闭</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item label="微信支付" prop="openWxpay" >
          <el-col :span="8">
            <el-radio v-model="pushData.openWxpay" :label="true">开启</el-radio>
            <el-radio v-model="pushData.openWxpay" :label="false">关闭</el-radio>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请修改接口参数获取二维码" :visible.sync="pushData2.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="addEditPopForm2" :model="pushData2" label-position="left">
        <el-form-item prop="content" >
          <el-input v-model="pushData2.content" type="textarea" clearable rows="8"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData2.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave2">确定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { infoData, saveData, delData, qrcode } from '@/api/tt-microapp'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      rules: {
        appid: [{ required: true, message: '不能为空' }],
        secret: [{ required: true, message: '不能为空' }]
      },

      multipleSelection: [],
      list: null,
      listResult: null,
      listLoading: true,
      statisticsData: {},
      pushData: {
        dialogFormVisible: false,

        id: undefined,
        appid: undefined,
        secret: undefined,
        payMerchantId: undefined,
        payAppId: undefined,
        paySecret: undefined,
        openAlipay: false,
        openWxpay: false
      },
      pushData2: {
        dialogFormVisible: false,

        content: `{appname: 'douyin'}`
      }
    }
  },
  created() {
    this.pushData2Tmp = Object.assign({}, this.pushData2)
    this.fetchData()
  },
  mounted() {},
  methods: {
    fetchData() {
      this.list = null
      this.listLoading = true
      infoData().then(response => {
        if (response.code === 0) {
          this.pushData = Object.assign({}, this.pushData2Tmp, response.data)
          this.list = [
            { name: 'AppID', val: response.data.appid },
            { name: 'AppSecret', val: response.data.secret },
            { name: '支付商户号', val: response.data.payMerchantId },
            { name: '支付App ID', val: response.data.payAppId },
            { name: '支付secret', val: response.data.paySecret },
            { name: '支付宝支付', val: response.data.openAlipay ? '开启' : '关闭' },
            { name: '微信支付', val: response.data.openWxpay ? '开启' : '关闭' }
          ]
          this.listResult = []
          this.listResult.push({ name: 'accesstoken', val: response.data.accesstoken })
          this.listResult.push({ name: '添加时间', val: response.data.dateAdd })
          this.listResult.push({ name: '更新时间', val: response.data.dateUpdate })
          this.listResult.push({ name: '刷新时间', val: response.data.dateRefresh })
        } else if (response.code === 700) {
          this.list = [
            { name: 'AppID', val: '未设置' },
            { name: 'AppSecret', val: '未设置' },
            { name: '支付商户号', val: '未设置' },
            { name: '支付App ID', val: '未设置' },
            { name: '支付secret', val: '未设置' },
            { name: '开启支付宝支付', val: '未设置' },
            { name: '开启微信支付', val: '未设置' }
          ]
          this.listResult = []
        }
        this.listLoading = false
      })
    },
    handleCreate() {
      this.pushData.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["addEditPopForm"].clearValidate();
      });
    },
    handleCreateSave() {
      this.$refs["addEditPopForm"].validate(valid => {
        if (valid) {
          saveData(this.pushData)
            .then(res => {
              if (res.code == 101) {
                this.$message.error('appid或secret不正确！');
              }
              if (res.code == 0) {
                this.pushData.dialogFormVisible = false;
                Message({
                  message: "操作成功",
                  type: "success",
                  duration: 1 * 1000
                });
                this.fetchData();
              } else {
                Message({
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
      });
    },
    fetchQrcode() {
      this.pushData2 = Object.assign({}, this.pushData2Tmp);
      this.pushData2.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["addEditPopForm2"].clearValidate();
      });
    },
    handleCreateSave2() {
      this.$refs["addEditPopForm2"].validate(valid => {
        if (valid) {
          qrcode(this.pushData2).then((res) => {
            this.pushData2.dialogFormVisible = false;            
            if (res.code != 0) {
              Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000
              })
              return;
            }
            this.$alert(`<img src="${res.data}" width="200" >`, '今日头条扫一扫', {
              dangerouslyUseHTMLString: true,
              showConfirmButton:false,
              center: true
            });
          }).catch((err) => {
            console.log(err);
          })          
        }
      });
    },
    delData(){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData().then(res => {
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
};
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
