<template>
  <div class="app-container">
    <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="120px">
      <el-form-item label="优惠券类型" prop="type">
        <el-col :span="8">
          <el-input v-model="pushData.type" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;自定义优惠券类型编码</el-col>
      </el-form-item>
      <el-form-item label="使用对象" prop="refId">
        <el-col :span="8">
          <el-input v-model="pushData.refId" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;例如填写商品编号，该优惠券只针对该商品有效,不填为全站通用</el-col>
      </el-form-item>
      <el-form-item label="口令" prop="pwd">
        <el-col :span="8">
          <el-input v-model="pushData.pwd" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;如果填写了口令，领取的时候必须输入正确的口令才能领取</el-col>
      </el-form-item>
      <el-form-item label="需要积分" prop="needScore">
        <el-col :span="8">
          <el-input v-model="pushData.needScore" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;需要多少积分兑换该优惠券</el-col>
      </el-form-item>
      <el-form-item label="连续签到" prop="needSignedContinuous">
        <el-col :span="8">
          <el-input v-model="pushData.needSignedContinuous" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;连续签到指定天数才能领取</el-col>
      </el-form-item>
      <el-form-item label="优惠券名称" prop="name" >
        <el-col :span="8">
          <el-input v-model="pushData.name" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>        
      </el-form-item>
      <el-form-item label="总数量" prop="numberTotle">
        <el-col :span="8">
          <el-input v-model="pushData.numberTotle" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;优惠券总数量，领完截止</el-col>
      </el-form-item>
      <el-form-item label="金额" required>
        <el-col :span="3">
          <el-form-item prop="moneyMin">
            <el-input v-model="pushData.moneyMin" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1" align="center">~</el-col>  
        <el-col :span="3">
          <el-form-item prop="moneyMax">
            <el-input v-model="pushData.moneyMax" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="17" class="orange">&nbsp;&nbsp;&nbsp;填写金额范围，两个值一样默认为固定金额优惠券，否则为随机</el-col>
      </el-form-item>
      <el-form-item label="使用条件" prop="moneyHreshold">
        <el-col :span="8">
          <el-input v-model="pushData.moneyHreshold" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;消费满多少金额可用</el-col>
      </el-form-item>
      <el-form-item label="每人限领" prop="numberPersonMax">
        <el-col :span="8">
          <el-input v-model="pushData.numberPersonMax" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-col>
        <el-col :span="16" class="orange">&nbsp;&nbsp;&nbsp;张，超过无法领取</el-col>
      </el-form-item>
      <el-form-item label="生效时间" required>
        <el-col :span="4">
          <el-form-item prop="dateStartType">
            <el-select v-model="pushData.dateStartType" placeholder="请选择">
              <el-option label="固定生效时间" value="0"></el-option>
              <el-option label="领取当天生效" value="1"></el-option>
              <el-option label="领取次日生效" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="pushData.dateStartType == 0">
          <el-form-item prop="dateStart">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择生效时间" v-model="pushData.dateStart"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="到期时间" required>
        <el-col :span="4">
          <el-form-item prop="dateEndType">
            <el-select v-model="pushData.dateEndType" placeholder="请选择">
              <el-option label="固定到期时间" value="0"></el-option>
              <el-option label="领取N天后到期" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="pushData.dateEndType == 0">
          <el-form-item prop="dateEnd">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择到期时间" v-model="pushData.dateEnd"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="pushData.dateEndType == 1">
          <el-form-item prop="dateEndDays">
            <el-input v-model="pushData.dateEndDays" placeholder="输入具体天数" clearable @keyup.enter.native="handleCreateSave"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="状态" prop="status" >
        <el-select v-model="pushData.status" placeholder="请选择">
          <el-option label="正常" value="0"></el-option>
          <el-option label="失效" value="1"></el-option>
          <el-option label="已过期/结束" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="扩展属性">
        <div v-for="kv in kvList" v-bind:key="kv.k" style="padding-bottom:10px;">
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
      <el-form-item>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </el-form-item>
    </el-form>    
  </div>
</template>

<script>
import { infoData, saveData } from '@/api/extDiscountsCoupon'

export default {
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '不能为空'},
        ],
        moneyMin: [
          { required: true, message: '不能为空'},
        ],
        moneyMax: [
          { required: true, message: '不能为空'},
        ],
        moneyHreshold: [
          { required: true, message: '不能为空'},
        ],
        dateStartType: [
          { required: true, message: '不能为空'},
        ],
        dateStart: [
          { required: true, message: '不能为空'},
        ],
        dateEndType: [
          { required: true, message: '不能为空'},
        ],
        dateEnd: [
          { required: true, message: '不能为空'},
        ],
        dateEndDays: [
          { required: true, message: '不能为空'},
        ],
        status: [
          { required: true, message: '不能为空'},
        ],
      },

      kvList:[
        {k:"", v:""}
      ],

      pushData: {
        id:undefined,
        needScore:0,
        needSignedContinuous:0,
        moneyHreshold:0,
        status:'0'
      },

      multipleSelection: [],
      list: null,
      listLoading: true
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)    
  },
  mounted() {
    if (this.$route.query.id) {
      infoData(this.$route.query.id).then(res => {
        if (res.code != 0) {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
          this.onCancel()
        } else {
          this.pushData = Object.assign({}, this.pushDataTmp, res.data.info, {dateStartType:'' + res.data.info.dateStartType, dateEndType:'' + res.data.info.dateEndType, status:'' + res.data.info.status})
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
          this.kvList = kvList
          this.$nextTick(() => {
            this.$refs['addEditPopForm'].clearValidate()
          })
        }
      }).catch(e=>{
        console.error(e);
      })
    }
  },
  methods: {
    onCancel() {
      this.$router.back();
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
    handleCreateSave(){
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
            if (res.code == 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000
              })
              this.onCancel()
            } else {
              this.$message({
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

<style rel="stylesheet/scss" lang="scss">
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}

</style>
