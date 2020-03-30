<template>

  <div class="app-container">

<div class="filter-container">
<el-button class="filter-item" style="margin-bottom: 10px;" @click="handleCreate" type="success" icon="el-icon-edit">设置</el-button>
</div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" :show-header="false" fit highlight-current-row empty-text="暂无数据">
      <el-table-column prop="name" label="name"></el-table-column>
      <el-table-column prop="val" label="val"></el-table-column>
    </el-table>

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="160px">
        <el-form-item label="包含字符" prop="str" >
          <el-input v-model="pushData.str" type="text" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="验证码长度" prop="strLength" >
          <el-input v-model="pushData.strLength" type="text" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="图片宽度" prop="width" >
          <el-input v-model="pushData.width" type="text" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="图片高度" prop="height" >
          <el-input v-model="pushData.height" type="text" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="干扰效果" prop="isAddEfect" >
          <el-radio v-model="pushData.isAddEfect" label="1">开启</el-radio>
          <el-radio v-model="pushData.isAddEfect" label="0">关闭</el-radio>
        </el-form-item>
        <el-form-item label="干扰线间距" prop="lineSpace" >
          <el-input v-model="pushData.lineSpace" type="text" clearable @keyup.enter.native="handleCreateSave"></el-input>
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
import { fetchDataList, saveData } from '@/api/apiExtVerificationPicConfig'
import { Message, MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'

let vm

export default {
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  data() {
    return {

      rules: {
        str: [
          { required: true, message: '不能为空'}
        ],
        strLength: [
          { required: true, message: '不能为空'}
        ],
        width: [
          { required: true, message: '不能为空'}
        ],
        height: [
          { required: true, message: '不能为空'}
        ],
        isAddEfect: [
          { required: true, message: '不能为空'}
        ],
        lineSpace: [
          { required: true, message: '不能为空'}
        ],
      },



      multipleSelection: [],
      appid:null,
      privateKey:null,
      list: null,
      listLoading: true,
      statisticsData:{},
      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        isAddEfect:'1'
      }
    }
  },
  created() {
    vm = this
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.fetchData()
  },
  mounted() {

  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page = val
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      fetchDataList().then(response => {
        if (response.code == 0) {
          vm.pushData = Object.assign({}, this.pushData, response.data, {isAddEfect:'' + response.data.isAddEfect})
          vm.list = []
          vm.list.push({name: '包含字符',val: response.data.str})
          vm.list.push({name: '验证码长度',val: response.data.strLength})
          vm.list.push({name: '图片宽度',val: response.data.width})
          vm.list.push({name: '图片高度',val: response.data.height})
          vm.list.push({name: '干扰效果',val: response.data.isAddEfect == 1 ? '开启' : '关闭'})
          vm.list.push({name: '干扰线间距',val: response.data.lineSpace})
        } else {
          Message({
            message: response.msg,
            type: 'error',
            duration: 3 * 1000
          })
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData.dialogTitle = '图片验证码配置'
      this.pushData.dialogFormVisible = true
      vm.$nextTick(() => {
        vm.$refs['addEditPopForm'].clearValidate()
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
    }
  }
}
</script>
