<template>
  <div class="app-container">
    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
      <el-card v-if="pushData.id" class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>用户标识</span>
        </div>
        <el-form-item label="用户编号">
          {{pushData.id}}
        </el-form-item>
      </el-card>
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>微信绑定</span>
        </div>
        <el-form-item label="openid">
          <el-col :span="15">
          <el-input v-model="pushData.openid" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="unionid">
          <el-col :span="15">
          <el-input v-model="pushData.unionid" clearable></el-input>
          </el-col>
        </el-form-item>
      </el-card>
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>用户资料</span>
        </div>
        <el-form-item label="注册渠道" prop="source">
          <el-select v-model="pushData.source" placeholder="请选择">
            <el-option label="小程序" :value="0" />
            <el-option label="手机注册" :value="1" />
            <el-option label="公众号" :value="2" />
            <el-option label="支付宝小程序" :value="3" />
            <el-option label="用户名注册" :value="4" />
            <el-option label="邮箱注册" :value="5" />
            <el-option label="QQ互联" :value="6" />
            <el-option label="微信登录" :value="7" />
            <el-option label="头条小程序" :value="8" />
            <el-option label="后台录入" :value="9" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传头像" >
          <img v-if="pushData.avatarUrl" :src="pushData.avatarUrl" class="avatar">
          <editorImage class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-col :span="15">
          <el-input v-model="pushData.mobile" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="用户名">
          <el-col :span="15">
          <el-input v-model="pushData.username" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-col :span="15">
          <el-input v-model="pushData.email" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-col :span="15">
          <el-input v-model="pushData.pwd" clearable></el-input>
          </el-col>
          <el-col :span="9" class="orange">
            &nbsp;&nbsp;&nbsp;留空代表不修改密码
          </el-col>
        </el-form-item>
        <el-form-item label="昵称">
          <el-col :span="15">
          <el-input v-model="pushData.nick" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="会员卡编号">
          <el-col :span="15">
          <el-input v-model="pushData.nfcCardId" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="pushData.levelId" placeholder="请选择">
            <el-option label="无会员" :value="0" />
            <el-option v-for="item in userLevels" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否分销商">
          <el-select v-model="pushData.isSeller" placeholder="请选择">
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="扩展属性">
          <div v-for="(kv, index) in kvList" :key="index" style="padding-bottom:10px;">
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="kv.k" @keyup.enter.native="handleCreateSave"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" align="center">:</el-col>  
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="kv.v" @keyup.enter.native="handleCreateSave"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14"> &nbsp;&nbsp;&nbsp;
              <el-button type="success" @click="addKV()">添加</el-button>
              <el-button type="danger" @click="delKV(kv.k)">删除</el-button>
            </el-col>     
            <div style="clear:both;"></div>     
          </div>
        </el-form-item>
      </el-card>
      <el-form-item style="margin-top:30px;">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    <Remark type="user" :refId="1*pushData.id"/> <!-- 添加本标签、import组件、components里面加入声明 -->
  </div>
</template>

<script>
import Remark from '@/components/Remark'
import { info, modifyUser, addNewUser } from '@/api/apiExtUser'
import { fetchAllUserLevels } from '@/api/apiExtUserLevel'
import { Message } from 'element-ui'

import editorImage from '@/components/Tinymce/components/editorImage' // 第一步

let vm

export default {
  components: {
    editorImage,
    Remark
  },
  data() {
    return {
      kvList: [
        { k: '', v: '' }
      ],

      rules: {
        title: [
          { required: true, message: '不能为空' }
        ],
        source: [
          { required: true, message: '不能为空' }
        ],
        categoryId: [
          { required: true, message: '不能为空' }
        ],
        keywords: [
          { required: true, message: '不能为空' }
        ],
        descript: [
          { required: true, message: '不能为空' }
        ],
        isRecommend: [
          { required: true, message: '不能为空' }
        ],
        status: [
          { required: true, message: '不能为空' }
        ],
        paixu: [
          { required: true, message: '不能为空' }
        ],
        kv: [
          { required: true, message: '不能为空' }
        ]
      },

      pushData: {
        id: undefined,
        mobile: undefined,
        username: undefined,
        email: undefined,
        nick: undefined,
        pwd: undefined,
        isSeller: false,
        levelId: 0,
        avatarUrl: undefined,
        nfcCardId: undefined,
        openid: undefined,
        source: undefined,
        unionid: undefined
      },
      userLevels: [],

      dialogTitle: undefined,
      dialogFormVisible: false,

      CmsCategoryList: [],
      extJson: {},
      curAddCityExceptionIndex: undefined,

      provinces: undefined,
      provinceSel: undefined,
      provinceShow: false,

      citys: undefined,
      citySel: undefined,
      cityShow: false,

      districts: undefined,
      districtSel: undefined,
      districtShow: false

    }
  },
  mounted() {
    const levelSearchData = {}
    levelSearchData.status = 0
    fetchAllUserLevels(1, 10000, levelSearchData).then(res => {
      if (res.code === 0) {
        this.userLevels = res.data.result
      }
    })
    vm = this
    if (this.$route.query.id) {
      this.pushData.id = this.$route.query.id
      info(this.$route.query.id).then(res => {
        if (res.code !== 0) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
          this.$router.push({ path: '/user/apiExtUser/list' })
        } else {
          if (res.data.userBase) {
            this.pushData = Object.assign(this.pushData, res.data.userBase)
            this.pushData.pwd = undefined;
            this.pushData.mobile = res.data.userBase.mobile;
            this.pushData.nick = res.data.userBase.nick;
            if (res.data.userBase.levelId) {
              this.pushData.levelId = res.data.userBase.levelId;
            } 
          }          
          if (res.data.userBaseWx && res.data.userBaseWx.openid) {
            this.pushData.openid = res.data.userBaseWx.openid;
            this.pushData.unionid = res.data.userBaseWx.unionid;
          }                             

          

          if (res.data.userBaseNfc) {
            this.pushData.nfcCardId = res.data.userBaseNfc.cardId
          }
          // 计算扩展属性
          let kvList = [];
          if (res.data.extJson) {
            Object.keys(res.data.extJson).forEach(k => {
              let aaaa = '{"k":"'+ k +'", "v":"'+ res.data.extJson[k] +'"}'
              kvList.push(JSON.parse(aaaa))
            })
          }
          if (kvList.length == 0) {
            kvList = [ {k:"", v:""} ];
          }
          vm.kvList = kvList
        }
      }).catch(e => {
        console.error(e)
      })
    }
  },
  methods: {
    addKV() {
      const kvMap = { k: '', v: '' }
      this.kvList.push(kvMap)
    },
    delKV(k) {
      const newArray = []
      this.kvList.forEach(ele => {
        if (ele.k !== k) {
          newArray.push(ele)
        }
      })
      if (newArray.length === 0) {
        newArray.push({ k: '', v: '' })
      }
      this.kvList = newArray
    },
    onSubmit() {
      let pushDataDetailsJsonStr = {}
      this.kvList.forEach(item => {
        if (item.k && item.v) {
          const aaaa = '{"' + item.k + '":"' + item.v + '"}'
          pushDataDetailsJsonStr = Object.assign({}, pushDataDetailsJsonStr, JSON.parse(aaaa))
        }
      })
      this.pushData.extJsonStr = JSON.stringify(pushDataDetailsJsonStr)
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          if (this.pushData.id) {
            // 修改
            if (!this.pushData.mobile) {
              this.pushData.mobile = 'unbind'
            }
            if (!this.pushData.nfcCardId) {
              this.pushData.nfcCardId = 'unbind'
            }
            if (!this.pushData.username) {
              this.pushData.username = 'unbind'
            }
            if (!this.pushData.email) {
              this.pushData.email = 'unbind'
            }
            const loadingInstance = this.$loading({
              text: '正在创建用户...'
            })
            modifyUser(this.pushData).then((res) => {
              this.pushData.dialogFormVisible = false
              if (res.code === 0) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$router.push({ path: '/user/apiExtUser/list' })
              } else {
                this.$message.error(res.msg)
              }
            }).catch(e => {
              console.error(e)
            }).finally(() => {
              loadingInstance.close()
            })
          } else {
            // 添加
            const loadingInstance = this.$loading({
              text: '正在创建用户...'
            })
            addNewUser(this.pushData).then((res) => {
              this.pushData.dialogFormVisible = false
              if (res.code === 0) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.$router.push({ path: '/user/apiExtUser/list' })
              } else {
                this.$message.error(res.msg)
              }
            }).catch(e => {
              console.error(e)
            }).finally(() => {
              loadingInstance.close()
            })
          }
        }
      })
    },
    onCancel() {
      this.$router.back();
    },
    addCityException(feeType){
      this.curAddCityExceptionIndex = feeType
      
      this.dialogTitle = '请选择配送地'
      this.dialogFormVisible = true

      this.provinceSel = undefined

      this.citys = undefined
      this.citySel = undefined
      this.cityShow = false

      this.districts = undefined
      this.districtSel = undefined
      this.districtShow = false
    },
    handleCreateSave(){
      let addExceptionObj = {name:'为指定地区城市设置运费', cityType:0, cityId:0, firstNumber:1, firstAmount:5, addNumber:1, addAmount:5}
      if (this.districtSel) {
        addExceptionObj.cityType = 2
        addExceptionObj.cityId = this.districtSel
        addExceptionObj.name = this.districts.find(item => {
          return item.id == addExceptionObj.cityId
        }).name
      } else if (this.citySel) {
        addExceptionObj.cityType = 1
        addExceptionObj.cityId = this.citySel
        addExceptionObj.name = this.citys.find(item => {
          return item.id == addExceptionObj.cityId
        }).name
      } else if (this.provinceSel) {
        addExceptionObj.cityType = 0
        addExceptionObj.cityId = this.provinceSel
        addExceptionObj.name = this.provinces.find(item => {
          return item.id == addExceptionObj.cityId
        }).name
      } else {
        this.$message({
          message: '请至少选择配送省份',
          type: 'error'
        })
        return
      }
      this.feeTypes[this.curAddCityExceptionIndex].details.push(addExceptionObj)
      this.dialogFormVisible = false    
    },
    imageSuccessCBK(arr) {
      if (arr && arr.length > 0) {
        this.pushData.avatarUrl = arr[0].url
      }      
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

