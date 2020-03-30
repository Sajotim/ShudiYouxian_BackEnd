<template>
  <div class="app-container">
    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
      <el-card class="box-card" shadow="never" style="margin-top:10px;">
        <el-form-item label="上传头像" >
          <img v-if="pushData.avatarUrl" :src="pushData.avatarUrl" class="avatar">
          <editorImage class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-col :span="15">
          <el-input v-model="pushData.mobile"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="姓名">
          <el-col :span="15">
          <el-input v-model="pushData.nick"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="名片信息">
          <div v-for="(kv, index) in kvList" :key="index" style="padding-bottom:10px;">
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="kv.k"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" align="center">:</el-col>  
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="kv.v"></el-input>
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
  </div>
</template>

<script>
import { info, modifyUser } from '@/api/apiExtUser'
import { fetchAllUserLevels } from '@/api/apiExtUserLevel'
import { savePageData, pageInfoKeyData } from '@/api/apiExtPage'

import { Message, MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

import editorImage from '@/components/Tinymce/components/editorImage' // 第一步

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
        categoryId: [
          { required: true, message: '不能为空'},
        ],
        keywords: [
          { required: true, message: '不能为空'}
        ],
        descript: [
          { required: true, message: '不能为空'}
        ],
        isRecommend: [
          { required: true, message: '不能为空'}
        ],
        status: [
          { required: true, message: '不能为空'}
        ],
        paixu: [
          { required: true, message: '不能为空'}
        ],
        kv: [
          { required: true, message: '不能为空'}
        ],
      },

      pushData: {
        id:undefined,
        isSeller:false,
        levelId:undefined,
        avatarUrl:undefined,
        mobile:undefined,
        nick:undefined
      },
      userLevels:[],

      dialogTitle : undefined,
      dialogFormVisible:false,

      CmsCategoryList:[],
      extJson:{},
      curAddCityExceptionIndex:undefined,

      provinces:undefined,
      provinceSel:undefined,
      provinceShow:false,

      citys:undefined,
      citySel:undefined,
      cityShow:false,

      districts:undefined,
      districtSel:undefined,
      districtShow:false,

      pageContent: {
        key: undefined,
        title: undefined,
        content: undefined
      }

    }
  },
  components: {
    editorImage
  },
  mounted() {
    vm = this
    if (this.$route.query.id) {
      this.pushData.id = this.$route.query.id
      info(this.$route.query.id).then(res => {
        if (res.code != 0) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
          this.$router.push({ path: '/aicard/list' })
        } else {          
          if (res.data.userBase) {
            this.pushData = Object.assign(this.pushData, res.data.userBase)
            this.pushData.mobile = res.data.userBase.mobile;
            this.pushData.nick = res.data.userBase.nick;
            if (res.data.userBase.levelId) {
              this.pushData.levelId = res.data.userBase.levelId;
            } 
          }          
          if (res.data.userBaseWx && res.data.userBaseWx.openid) {
            this.pushData.openid = res.data.userBaseWx.openid;
          }                             

          let levelSearchData = {}
          levelSearchData.status = 0
          fetchAllUserLevels(1, 10000, levelSearchData).then(res2 =>{
            if (res2.code === 0) {
              vm.userLevels = res2.data.result
            }
          })
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
      }).catch(e=>{
        console.error(e);
      })
      vm.pageContent.key = this.$route.query.id
      vm.pageContent.title = this.$route.query.id
      pageInfoKeyData(this.$route.query.id).then(res => {
        if (res.code == 0) {
          vm.pageContent = res.data
        }
      }).catch(e=>{
        console.error(e);
      })
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.pushData.pic = res.data.url;
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type.indexOf('image/') != -1);
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是图片格式!');
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
      }
      return isJPG && isLt1M;
    },
    addKV(){
      let kvMap = {k:"", v:""}
      this.kvList.push(kvMap)
    },
    delKV(k){
      let newArray = []
      this.kvList.forEach(ele => {
        if (ele.k != k) {
          newArray.push(ele)
        }
      })
      if (newArray.length == 0) {
        newArray.push({k:"", v:""})
      }
      this.kvList = newArray
    },
    onSubmit() {
      let pushDataDetailsJsonStr = {}
      this.kvList.forEach(item => {
        // {k:"", v:""}
        if (item.k && item.v) {
          let aaaa = '{"'+ item.k +'":"'+ item.v +'"}'
          pushDataDetailsJsonStr = Object.assign({}, pushDataDetailsJsonStr, JSON.parse(aaaa))
        }        
      })
      this.pushData.extJsonStr = JSON.stringify(pushDataDetailsJsonStr)
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          modifyUser(this.pushData).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.$router.push({ path: '/aicard/list' })
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

