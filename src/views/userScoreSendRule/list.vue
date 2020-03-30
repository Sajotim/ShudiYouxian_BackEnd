<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-button class="filter-item" size="medium" @click="handleCreate()" type="success" icon="el-icon-plus">添加</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column prop="codeStr" label="赠送场景"></el-table-column>
      <el-table-column prop="confine" label="赠送条件"></el-table-column>
      <el-table-column prop="score" label="赠送积分数"></el-table-column>
      <el-table-column label="当日赠送上限">
        <template slot-scope="scope">
          <font v-if="scope.row.maxPerDay == 0">不限</font>
          <font v-else>{{scope.row.maxPerDay}}</font>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="130px">
        <el-form-item label="赠送场景" prop="code" >
          <el-select v-model="pushData.code" placeholder="请选择">
            <el-option label="注册送" value="REG"></el-option>
            <el-option label="消费送" value="CONSUME"></el-option>
            <el-option label="充值送" value="RECHARGE"></el-option>
            <el-option label="好评送" value="goodReputation"></el-option>
            <el-option label="邀请用户" value="invite"></el-option>
            <el-option label="转发微信群" value="shareWxGroup"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="pushData.code == 'invite'" style="color:red;">
          邀请其他用户注册，被邀请用户注册成功后获得赠送
        </el-form-item>
        <el-form-item v-if="pushData.code != 'invite' && pushData.code != 'REG' && pushData.code != 'goodReputation' && pushData.code != 'shareWxGroup'" label="赠送条件" prop="confine">
          <el-col :span="6">
            <el-input v-model="pushData.confine" :min="1" clearable @keyup.enter.native="handleCreateSave" style="width: 97%;"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item v-if="pushData.code != 'invite' && pushData.code != 'REG' && pushData.code != 'goodReputation' && pushData.code != 'shareWxGroup'">
          <div style="color:red;">
            达到多少条件赠送，这是一个数字类型，消费满/充值满多少金额，如果是注册、好评等，直接填0即可
          </div>
        </el-form-item>
        <el-form-item label="赠送积分" prop="score">
          <el-col :span="6">
            <el-input v-model="pushData.score" :min="1" clearable @keyup.enter.native="handleCreateSave" style="width: 97%;"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item v-if="pushData.code == 'shareWxGroup'" label="当日赠送上限" prop="maxPerDay">
          <el-col :span="6">
            <el-input v-model="pushData.maxPerDay" @keyup.enter.native="handleCreateSave" style="width: 97%;"></el-input>
          </el-col>
          <el-col :span="16" style="color:red">&nbsp;&nbsp;&nbsp;填0为不设上限</el-col>
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
import { fetchDataList, infoData, delData, saveData } from '@/api/userScoreSendRule'
import { Message, MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  data() {
    return {
      rules: {
        code: [
          { required: true, message: '不能为空'},
        ],
        confine: [
          { required: true, message: '不能为空'},
        ],
        score: [
          { required: true, message: '不能为空'},
        ],
        maxPerDay: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{},

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        confine:0,
        score:1,
        maxPerDay:0
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      statisticsData:{}
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.fetchData()
  },
  mounted() {
    
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      fetchDataList(this.searchData).then(response => {
        if (response.code === 0) {
          this.list = response.data.result
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '添加积分赠送规则'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdate(id){
      infoData(id).then(res => {
        if (res.code !== 0) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.pushData = Object.assign({}, this.pushDataTmp, res.data, {dateType:'' + res.data.dateType, isPub:'' + res.data.isPub, content:res.data.value})
          this.pushData.dialogTitle = '修改积分赠送规则'
          this.pushData.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['addEditPopForm'].clearValidate()
          })
        }
      }).catch(e=>{
        console.error(e);
      })
    },
    handleCreateSave(){
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
              this.fetchData()
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
    delData(id){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData(id).then(res => {
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
