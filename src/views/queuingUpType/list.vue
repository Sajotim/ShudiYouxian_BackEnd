<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="正常" value="0"></el-option>
        <el-option label="关闭" value="1"></el-option>
        <el-option label="名额已满" value="2"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-edit">添加</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }} 
          <el-tooltip
            class="item"
            effect="dark"
            v-if="scope.row.descript"
            :content="scope.row.descript" 
            placement="right">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 0">正常</el-tag>
          <el-tag type="info" v-if="scope.row.status == 1">关闭</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 2">已满</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="已取/限额">
        <template slot-scope="scope">
          {{ scope.row.numberGet }} 
          <br>
          {{ scope.row.numberTotle ? scope.row.numberTotle : '-' }} 
        </template>
      </el-table-column>
      <el-table-column label="当前号子" prop="curNumber" />
      <el-table-column label="预计服务时长">
        <template slot-scope="scope">
          {{ scope.row.minitus }} 分钟
        </template>
      </el-table-column>
      <el-table-column label="开始/截止时间" width="160">
        <template slot-scope="scope">
         {{scope.row.dateBegin?scope.row.dateBegin:'-'}}<br>
         {{scope.row.dateEnd?scope.row.dateEnd:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="openConsole(scope.row.id)">叫号台</el-button>
          &nbsp;&nbsp;
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              其他操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleUpdate(scope.row.id)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="handleReset(scope.row.id)">重置队列</el-dropdown-item>
              <el-dropdown-item @click.native="delData(scope.row.id)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow" style="margin-top:20px;">
    </el-pagination>

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="名称" prop="name" >
          <el-input v-model.number="pushData.name" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="paixu" >
          <el-input v-model.number="pushData.paixu" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="预计时长" prop="minitus">
          <el-col :span="4">
            <el-form-item prop="minitus">
              <el-input v-model.number="pushData.minitus" clearable @keyup.enter.native="handleCreateSave"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;分钟</el-col>
          <el-col :span="18">&nbsp;&nbsp;&nbsp;（ 每个号子预计服务时长）</el-col>
        </el-form-item>
        <el-form-item label="队列说明" prop="descript" >
          <el-input v-model="pushData.descript" type="textarea" :rows="4" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" >
          <el-select v-model="pushData.status" placeholder="请选择">
            <el-option label="正常" value="0"></el-option>
            <el-option label="关闭" value="1"></el-option>
            <el-option label="名额已满" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取号限额">
          <el-col :span="4">
            <el-form-item prop="numberTotle">
              <el-input v-model.number="pushData.numberTotle" clearable @keyup.enter.native="handleCreateSave"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">&nbsp;&nbsp;&nbsp;总取号超过该数字将无法继续取号</el-col>
        </el-form-item>
        <el-form-item label="开始时间" prop="dateBeginStr" >
          <el-date-picker v-model="pushData.dateBeginStr" clearable type="datetime" placeholder="点击选择" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间" prop="dateEndStr" >
          <el-date-picker v-model="pushData.dateEndStr" clearable type="datetime" placeholder="点击选择" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogTitle2" :visible.sync="dialogFormVisible2" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="当前叫号">
          {{curService.log.number}}
        </el-form-item>
        <el-form-item label="等待人数">
          {{curService.type.numberGet - curService.type.curNumber}}
        </el-form-item>        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">退出</el-button>
        <el-button type="primary" disabled>叮咚</el-button>
        <el-button type="warning" disabled>重呼</el-button>
        <el-button type="danger" @click="jumpCurService">无人过号</el-button>
        <el-button type="success" @click="successCurService">下一位</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchQueuingUpTypeList, info, delData, saveData, resetData, curService, jumpCurService, successCurService } from '@/api/queuingUpType'
import { Message, MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  data() {
    return {
      page:1,
      pageSize:10,
      totalRow:0,

      dialogTitle2:undefined,
      dialogFormVisible2:false,


      rules: {
        name: [
          { required: true, message: '不能为空'}
        ],
        paixu: [
          { required: true, message: '不能为空'}
        ],
        status: [
          { required: true, message: '不能为空'}
        ],
        minitus: [
          { required: true, message: '不能为空'}
        ],
        
      },

      searchData:{
        
      },

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        paixu:0,
        status:'0'
      },
      curServiceId:undefined,
      curServiceWindow:undefined,
      curServiceLogId:undefined,
      curService:{
        log:{
          number :0
        },
        type:{
          numberGet:0,
          curNumber:0
        }
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      statisticsData:{}
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.curServiceTmp = Object.assign({}, this.curService)
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
      fetchQueuingUpTypeList(this.page, this.pageSize, this.searchData).then(response => {
        if (response.code == 0) {
          this.list = response.data.result
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '增加叫号队列'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdate(id){
      info(id).then(res => {
        if (res.code != 0) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.pushData = Object.assign({}, this.pushDataTmp, res.data, {status:'' + res.data.status, refundType:'' + res.data.refundType, dateAddStr:res.data.dateAdd, dateEndStr:res.data.dateEnd})
          this.pushData.dialogTitle = '修改叫号队列'
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
    handleReset(id){
      this.$confirm('重置将初始化该叫号队列, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetData(id).then(res => {
          Message({
            message: '重置成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
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
    },
    openConsole(id){
      this.$prompt('请输入服务窗口或者桌号', '叫号台', {
        confirmButtonText: '确定',
        cancelButtonText: '关闭'
      }).then(({ value }) => {
        if (!value) {
          Message({
            message: '请输入服务窗口或者桌号',
            type: 'error',
            duration: 3 * 1000
          })
          return true
        }
        this.dialogTitle2 = '叫号台 - ' + value
        this.fetchCurService(id, value)
      })
    },
    fetchCurService(id, serviceWindow){
      curService(id, serviceWindow).then(res => {
        if (res.code == 0) {
          this.curService = Object.assign({}, this.curServiceTmp, res.data)
          this.curServiceId = id
          this.curServiceWindow = serviceWindow
          this.curServiceLogId = res.data.log.id
          this.dialogFormVisible2 = true
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        }
      })
    },
    jumpCurService(){
      jumpCurService(this.curServiceId, this.curServiceWindow).then(res => {
        if (res.code == 0) {
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchCurService(this.curServiceId, this.curServiceWindow)
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        }
      })
    },
    successCurService(){
      successCurService(this.curServiceId, this.curServiceWindow, this.curServiceLogId).then(res => {
        if (res.code == 0) {
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchCurService(this.curServiceId, this.curServiceWindow)
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
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
