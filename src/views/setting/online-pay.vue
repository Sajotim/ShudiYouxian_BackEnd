<template>
  <div class="app-container">
    <el-tabs v-model="pushData.type" type="border-card" @tab-click="tabChanged">
      <el-tab-pane v-for="t in typeArray" :key="t.code" :name="t.name" :label="t.label">
        <div class="filter-container">
          <el-button size="small" class="filter-item" style="margin-bottom: 10px;" type="success" icon="el-icon-setting" @click="handleCreate">设置</el-button>
          <el-button size="small" class="filter-item" style="margin-bottom: 10px;" type="danger" icon="el-icon-delete" @click="delData">删除设置</el-button>
        </div>
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" :show-header="false" fit highlight-current-row empty-text="暂无数据">
          <el-table-column prop="name" label="name" />
          <el-table-column prop="val" label="val" />
        </el-table>
        <el-upload
          v-if="pushData.type == 'wxpay'"
          class="upload-demo"
          style="margin-top:32px;"
          :action="uploadUrl"
          name="file"
          accept="application/x-pkcs12"
          :headers="uploadUrlHeaders"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <el-button slot="trigger" class="filter-item" size="small" type="primary" icon="el-icon-key">上传微信支付API证书</el-button>
          <a href="https://kf.qq.com/faq/161222NneAJf161222U7fARv.html" target="_blank" style="color:red;">&nbsp;什么是API证书，如何获取API证书？</a>
        </el-upload>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form v-if="pushData.type == 'lcsw'" :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="160px">
        <el-form-item label="商户号" prop="merchantNo">
          <el-input v-model="pushData.merchantNo" type="text" clearable></el-input>
        </el-form-item>
        <el-form-item label="终端号" prop="terminalId">
          <el-input v-model="pushData.terminalId" type="text" clearable></el-input>
        </el-form-item>
        <el-form-item label="注册终端获取的令牌" prop="accessToken">
          <el-input v-model="pushData.accessToken" type="text" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-form v-if="pushData.type == 'wepayez'" :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="160px">
        <el-form-item label="商户号" prop="merchantNo">
          <el-input v-model="pushData.merchantNo" type="text" clearable></el-input>
        </el-form-item>
        <el-form-item label="秘钥" prop="accessToken">
          <el-input v-model="pushData.accessToken" type="text" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-form v-if="pushData.type == 'intelsalon'" :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="160px">
        <el-form-item label="app_key" prop="appKey">
          <el-input v-model="pushData.appKey" type="text" clearable></el-input>
        </el-form-item>
        <el-form-item label="app_secret" prop="appSecret">
          <el-input v-model="pushData.appSecret" type="text" clearable></el-input>
        </el-form-item>
        <el-form-item label="商户号" prop="merid">
          <el-input v-model="pushData.merid" type="text" clearable></el-input>
        </el-form-item>
        <el-form-item label="门店编号" prop="shopid">
          <el-input v-model="pushData.shopid" type="text" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-form v-if="pushData.type == 'alipay'" :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="160px">
        <el-form-item label="appId" prop="appId">
          <el-col :span="8">
            <el-input v-model="pushData.appId" type="text" clearable />
          </el-col>
          <el-col :span="16">&nbsp;&nbsp;支付宝开放平台应用的APPID</el-col>
        </el-form-item>
        <el-form-item label="RSA2私钥" prop="privateKey">
          <el-col :span="8">
            <el-input v-model="pushData.privateKey" type="text" clearable />
          </el-col>
          <el-col :span="16">&nbsp;&nbsp;你自己生成的RSA2私钥，确保公钥已经传到支付宝</el-col>
        </el-form-item>
        <el-form-item label="支付宝公钥" prop="aliPublicKey">
          <el-col :span="8">
            <el-input v-model="pushData.aliPublicKey" type="text" clearable />
          </el-col>
          <el-col :span="16">&nbsp;&nbsp;请前往支付宝开放平台查看公钥</el-col>
        </el-form-item>
      </el-form>
      <el-form v-if="pushData.type == 'wxpay'" ref="addEditPopForm" :rules="rules" :model="pushData" label-position="left" label-width="160px">
        <el-form-item label="商户号" prop="mchId">
          <el-col :span="8">
            <el-input v-model="pushData.mchId" type="text" clearable />
          </el-col>
          <el-col :span="16">&nbsp;&nbsp;<a href="https://kf.qq.com/faq/170104vMBNbe170104I3YviY.html" target="_blank">什么是微信支付商户号？</a></el-col>
        </el-form-item>
        <el-form-item label="api安全秘钥" prop="mchKey">
          <el-col :span="8">
            <el-input v-model="pushData.mchKey" type="text" clearable />
          </el-col>
          <el-col :span="16">&nbsp;&nbsp;<a href="https://kf.qq.com/faq/180830UVRZR7180830Ij6ZZz.html" target="_blank">什么是API密钥？如何设置或修改？</a></el-col>
        </el-form-item>
      </el-form>
      <el-form v-if="pushData.type == 'baiwei'" ref="addEditPopForm" :rules="rules" :model="pushData" label-position="left" label-width="160px">
        <el-form-item label="智百威ID" prop="bwNo">
          <el-col :span="8">
            <el-input v-model="pushData.bwNo" type="text" clearable />
          </el-col>
        </el-form-item>
        <el-form-item label="智百威秘钥" prop="bwApiKey">
          <el-col :span="8">
            <el-input v-model="pushData.bwApiKey" type="text" clearable />
          </el-col>
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
import { info, saveData, delData } from '@/api/online-pay'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {

      uploadUrl: process.env.VUE_APP_BASE_API + '/user/centerUserWxKey/save/certFile',
      uploadUrlHeaders: {
        'X-Token': getToken()
      },

      typeArray: [
        {
          name: 'wxpay',
          label: '微信支付'
        },
        {
          name: 'alipay',
          label: '支付宝'
        },
        {
          name: 'lcsw',
          label: '扫呗在线支付'
        },
        {
          name: 'wepayez',
          label: 'wepayez境外支付'
        },
        {
          name: 'intelsalon',
          label: '云美集付'
        },
        {
          name: 'baiwei',
          label: '智百威支付'
        }
      ],

      rules: {
        type: [{ required: true, message: '不能为空' }],
        merchantNo: [{ required: true, message: '不能为空' }],
        terminalId: [{ required: true, message: '不能为空' }],
        accessToken: [{ required: true, message: '不能为空' }],
        appKey: [{ required: true, message: '不能为空' }],
        appSecret: [{ required: true, message: '不能为空' }],
        merid: [{ required: true, message: '不能为空' }],
        shopid: [{ required: true, message: '不能为空' }],
        appId: [{ required: true, message: '不能为空' }],
        privateKey: [{ required: true, message: '不能为空' }],
        aliPublicKey: [{ required: true, message: '不能为空' }],
        mchId: [{ required: true, message: '不能为空' }],
        mchKey: [{ required: true, message: '不能为空' }],
        bwNo: [{ required: true, message: '不能为空' }],
        bwApiKey: [{ required: true, message: '不能为空' }]
      },

      multipleSelection: [],
      appid: null,
      privateKey: null,
      list: null,
      listLoading: true,
      statisticsData: {},
      pushData: {
        dialogTitle: undefined,
        dialogFormVisible: false,

        id: undefined,
        type: 'wxpay',
        merchantNo: undefined,
        terminalId: undefined,
        accessToken: undefined,
        merid: undefined,
        shopid: undefined,
        appKey: undefined,
        appSecret: undefined,
        appId: undefined,
        privateKey: undefined,
        aliPublicKey: undefined,
        mchId: undefined,
        mchKey: undefined,
        bwNo: undefined,
        bwApiKey: undefined
      }
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.fetchData()
  },
  mounted() {},
  methods: {
    tabChanged() {
      this.fetchData()
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      info().then(response => {
        if (response.code !== 0) {
          this.$message.error(response.msg)
          return
        }
        if (this.pushData.type === 'lcsw') {
          if (response.data.lcsw) {
            this.pushData = Object.assign({}, this.pushData, response.data.lcsw);
            this.list = [
              { name: "商户号", val: response.data.lcsw.merchantNo },
              { name: "终端号", val: response.data.lcsw.terminalId },
              { name: "注册终端获取的令牌", val: response.data.lcsw.accessToken }
            ];
          } else {
            this.list = [
              { name: "商户号", val: "未设置" },
              { name: "终端号", val: "未设置" },
              { name: "注册终端获取的令牌", val: "未设置" }
            ];
          }
        }
        if (this.pushData.type === 'wepayez') {
          if (response.data.wepayez) {
            this.pushData = Object.assign({}, this.pushData, response.data.wepayez);
            this.pushData.merchantNo = response.data.wepayez.mchId
            this.pushData.accessToken = response.data.wepayez.mchKey
            this.list = [
              { name: "商户号", val: response.data.wepayez.mchId },
              { name: "秘钥", val: response.data.wepayez.mchKey }
            ];
          } else {
            this.list = [
              { name: "商户号", val: "未设置" },
              { name: "秘钥", val: "未设置" }
            ];
          }
        }
        if (this.pushData.type == 'intelsalon') {
          if (response.data.intelsalon) {
            this.pushData = Object.assign({}, this.pushData, response.data.intelsalon);
            this.list = [
              { name: "app_key", val: response.data.intelsalon.appKey },
              { name: "app_secret", val: response.data.intelsalon.appSecret },
              { name: "商户号", val: response.data.intelsalon.merid },
              { name: "门店编号", val: response.data.intelsalon.shopid },
            ];
          } else {
            this.list = [
              { name: "app_key", val: "未设置" },
              { name: "app_secret", val: "未设置" },
              { name: "商户号", val: "未设置" },
              { name: "门店编号", val: "未设置" },
            ];
          }
        }
        if (this.pushData.type === 'alipay') {
          if (response.data.alipay) {
            this.pushData = Object.assign({}, this.pushData, response.data.alipay)
            this.list = [
              { name: 'APPID', val: response.data.alipay.appId },
              { name: 'RSA2私钥', val: response.data.alipay.privateKey },
              { name: '支付宝公钥', val: response.data.alipay.aliPublicKey }
            ]
          } else {
            this.list = [
              { name: 'APPID', val: '未设置' },
              { name: 'RSA2私钥', val: '未设置' },
              { name: '支付宝公钥', val: '未设置' }
            ]
          }
        }
        if (this.pushData.type === 'wxpay') {
          if (response.data.wxpay) {
            this.pushData = Object.assign({}, this.pushData, response.data.wxpay)
            this.list = [
              { name: '商户号', val: response.data.wxpay.mchId },
              { name: 'api安全秘钥', val: response.data.wxpay.mchKey },
              { name: '支付证书', val: response.data.wxpay.mchCertFile ? '已上传' : '未上传' }
            ]
          } else {
            this.list = [
              { name: '商户号', val: '未设置' },
              { name: 'api安全秘钥', val: '未设置' },
              { name: '支付证书', val: '未上传' }
            ]
          }
        }
        if (this.pushData.type === 'baiwei') {
          if (response.data.baiwei) {
            this.pushData = Object.assign({}, this.pushData, response.data.baiwei)
            this.list = [
              { name: '智百威ID', val: response.data.baiwei.bwNo },
              { name: '智百威秘钥', val: response.data.baiwei.bwApiKey }
            ]
          } else {
            this.list = [
              { name: '智百威ID', val: '未设置' },
              { name: '智百威秘钥', val: '未设置' }
            ]
          }
        }
        this.listLoading = false
      })
    },
    handleCreate() {
      this.pushData.dialogTitle = '在线支付配置'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    delData() {
      this.$confirm("删除无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delData(this.pushData.type).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.fetchData();
          });
        })
        .catch(() => {});
    },
    handleCreateSave() {
      this.$refs["addEditPopForm"].validate(valid => {
        if (valid) {
          saveData(this.pushData)
            .then(res => {
              this.pushData.dialogFormVisible = false;
              if (res.code == 0) {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.fetchData();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(e => {
              console.error(e);
            });
        }
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type.indexOf('application/x-pkcs12') !== -1)
      if (!isJPG) {
        this.$message.error('请上传 p12 格式的证书文件')
      }
      return isJPG
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 700) {
        this.$message.error('请先配置appid和secret再上传支付证书')
      }
      if (res.code === 0) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this.fetchData()
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>
