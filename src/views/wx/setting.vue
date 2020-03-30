<template>
  <div class="app-container">
    <el-alert
      title="微信支付设置功能，迁移至 “系统设置” --> “在线支付设置”，请移步至支付配置设置微信支付信息。"
      type="error"
      effect="dark"
    />
    <div class="filter-container" style="margin-top:16px;">
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

    <el-dialog title="配置appid/secret" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="160px">
        <el-form-item label="appid" prop="appid">
          <el-col :span="8">
            <el-input v-model="pushData.appid" type="text" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" style="padding-left:20px;">登录 <a href="https://mp.weixin.qq.com/" target="_blank">https://mp.weixin.qq.com/</a> 查看</el-col>
        </el-form-item>
        <el-form-item label="secret" prop="secret">
          <el-col :span="8">
            <el-input v-model="pushData.secret" type="text" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" style="padding-left:20px;">登录 <a href="https://mp.weixin.qq.com/" target="_blank">https://mp.weixin.qq.com/</a> 查看</el-col>
        </el-form-item>
        <el-form-item label="token" prop="wxtoken">
          <el-col :span="8">
            <el-input v-model="pushData.wxtoken" type="text" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-col>
          <el-col :span="16" style="padding-left:20px;color:red;">消息推送令牌，一般无需填写，留空即可</el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="小程序获取二维码" :visible.sync="pushData2.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="addEditPopForm2" :model="pushData2" label-position="left" label-width="160px">
        <el-form-item label="页面路径" prop="content" >
          <el-input v-model="pushData2.content" type="text" clearable @keyup.enter.native="handleCreateSave2"></el-input>
        </el-form-item>
        <el-form-item label="二维码的宽度" prop="width" >
          <el-input v-model.number="pushData2.width" type="text" clearable @keyup.enter.native="handleCreateSave2"></el-input>
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
import { infoData, saveData, delData, qrcode } from "@/api/centerUserWxKey";
import { Message } from "element-ui"
import { mapGetters } from "vuex"

export default {
  data() {
    return {
      rules: {
        appid: [{ required: true, message: "不能为空" }],
        secret: [{ required: true, message: "不能为空" }]
      },

      multipleSelection: [],
      appid: null,
      privateKey: null,
      list: null,
      listResult: null,
      listLoading: true,
      statisticsData: {},
      pushData: {
        dialogFormVisible: false,

        id: undefined,
        appid: undefined,
        secret: undefined,
        wxtoken: undefined
      },
      pushData2: {
        dialogFormVisible: false,

        content: 'pages/index/index',
        width: undefined
      }
    }
  },
  created() {
    this.pushData2Tmp = Object.assign({}, this.pushData2);
    this.fetchData();
  },
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchData() {
      this.list = null;
      this.listLoading = true;
      infoData().then(response => {
        if (response.code == 0) {
          (this.appid = response.data.appid),
            (this.privateKey = response.data.privateKey),
            (this.list = [
              { name: "appid", val: response.data.appid },
              { name: "secret", val: response.data.secret },
              { name: "token", val: response.data.wxtoken }
            ])
            this.pushData.appid = response.data.appid
            this.pushData.secret = response.data.secret
            this.pushData.wxtoken = response.data.wxtoken
          this.listResult = []
          this.listResult.push({ name: "accesstoken", val: response.data.accesstoken })
          this.listResult.push({ name: "jsTicket", val: response.data.jsTicket })
          this.listResult.push({ name: "添加时间", val: response.data.dateAdd })
          this.listResult.push({ name: "更新时间", val: response.data.dateUpdate })
          this.listResult.push({ name: "刷新时间", val: response.data.dateRefresh })
        } else if (response.code == 700) {
          this.list = [
            { name: "appid", val: "未设置" },
            { name: "secret", val: "未设置" },
            { name: "token", val: "未设置" }
          ]
          this.listResult = []
        }
        this.listLoading = false;
      });
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
            this.$alert(`<img src="${res.data}" width="200" >`, '微信扫一扫', {
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
