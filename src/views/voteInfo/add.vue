<template>
  <div class="app-container">
    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-width="120px">
      <el-form-item label="投票类型" prop="rule">
        <el-col :span="4">
          <el-select style="width: 100%" v-model="pushData.rule">
            <el-option label="单选" :value='0'></el-option>
            <el-option label="多选" :value='1'></el-option>
          </el-select>          
        </el-col>   
        <el-col :span="10" class="orange">&nbsp;&nbsp;&nbsp;投票的时候是否可选择多个选项</el-col>
      </el-form-item>
      <el-form-item label="是否公开" prop="isPublic">
        <el-col :span="4">
          <el-select style="width: 100%" v-model="pushData.isPublic">
            <el-option label="不公开" :value='false'/>
            <el-option label="公开" :value='true'/>
          </el-select>
        </el-col>
        <el-col :span="10" class="orange">&nbsp;&nbsp;&nbsp;投票记录是否公开，公开后可查看参与投票的用户</el-col>
      </el-form-item>
      <el-card class="box-card" style="margin:16px 0;">
        <div slot="header" class="clearfix">
          <span>投票限制</span>
          <small style="color:red">设置用户投票规则</small>
        </div>
        <el-form-item label="每天可投" prop="limitUserDay">
          <el-col :span="4">
            <el-input v-model="pushData.limitUserDay">
              <template slot="append">次</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="最多可投" prop="limitUserTotal">
          <el-col :span="4">
            <el-input v-model="pushData.limitUserTotal">
              <template slot="append">次</template>
            </el-input>
          </el-col>
          <el-col :span="20" class="orange">&nbsp;&nbsp;&nbsp;0为不限制</el-col>
        </el-form-item>
      </el-card>
      <el-form-item label="标题" prop="title">
        <el-input v-model="pushData.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <Tinymce :height=500 ref="editor" v-model="pushData.content"/>
      </el-form-item>
      <el-form-item label="开始时间" prop="dateBeginStr" >
        <el-date-picker v-model="pushData.dateBeginStr" clearable type="datetime" placeholder="点击选择" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="截止时间" prop="dateEndStr" >
        <el-date-picker v-model="pushData.dateEndStr" clearable type="datetime" placeholder="点击选择" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status" >
        <el-select v-model="pushData.status" placeholder="请选择">
          <el-option label="开启" :value="0"></el-option>
          <el-option label="关闭" :value="1"></el-option>
        </el-select>
      </el-form-item>      
      <el-form-item label="扩展属性">
        <div v-for="kv in kvList" v-bind:key="kv.k" style="padding-bottom:10px;">
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
      
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { saveData, infoData } from '@/api/voteInfo'
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
          { required: true, message: '不能为空' }
        ],
        isMemberLimit: [
          { required: true, message: '不能为空' }
        ],
        isAllowTeam: [
          { required: true, message: '不能为空' }
        ],
        isPublic: [
          { required: true, message: '不能为空' }
        ],
        numberMax: [
          { required: true, message: '不能为空' }
        ],
        amount: [
          { required: true, message: '不能为空' }
        ],
        status: [
          { required: true, message: '不能为空' }
        ],
        limitUserDay: [
          { required: true, message: '不能为空' }
        ],
        limitUserTotal: [
          { required: true, message: '不能为空' }
        ]
      },

      pushData: {
        id: undefined,
        type: 0,
        rule: 0,
        paixu: 0,
        isMemberLimit: false,
        isAllowTeam: false,
        isPublic: false,
        numberMax: 0,
        amount: 0,
        status: 0,
        limitUserDay: 1,
        limitUserTotal: 1
      },

      dialogTitle: undefined,
      dialogFormVisible: false,

      extJson: {},

      curAddCityExceptionIndex: undefined,

      provinces: undefined,
      provinceSel: undefined,
      provinceShow: false,

      citys: undefined,
      citySel: undefined,
      cityShow: false,

      districts:undefined,
      districtSel:undefined,
      districtShow:false,

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
          this.$router.push({ path: '/user/voteInfo/list' })
        } else {
          vm.pushData = Object.assign({}, res.data.info)
          if (vm.pushData.pic) {
            this.imageUrl = new URL(vm.pushData.pic);
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
      }).catch(e=>{
        console.error(e);
      })
    }
  },
  methods: {
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
          saveData(this.pushData).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.$router.push({ path: '/user/voteInfo/list' })
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

