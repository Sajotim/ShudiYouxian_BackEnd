<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="编号" v-model="searchData.id">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="标题" v-model="searchData.titleLike">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="开启" value="0"></el-option>
        <el-option label="关闭" value="1"></el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.isAllowTeam" placeholder="团队">
        <el-option label="支持" :value="true"></el-option>
        <el-option label="不支持" :value="false"></el-option>
      </el-select>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button size="medium" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">添加</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column prop="id" label="编号" width="100%"></el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{scope.row.title}}<br>
          <el-tag size="mini" type="success" v-if="scope.row.amount == 0">免费参与</el-tag>
          <el-tag size="mini" type="danger" v-if="scope.row.amount > 0">付费参与 ￥ {{scope.row.amount}}</el-tag>
          <el-tag size="mini" type="warning" v-if="scope.row.isAllowTeam">团队</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.isPublic">报名信息公开</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始/截止时间" width="160">
        <template slot-scope="scope">
          {{scope.row.dateBegin ? scope.row.dateBegin : '立即开始'}}
          <br>
          {{scope.row.dateEnd ? scope.row.dateEnd : '永久有效'}}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100%">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 0">开启</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 1">关闭</el-tag>
        </template>
      </el-table-column>   
      <el-table-column label="参与人数" width="100%">
        <template slot-scope="scope">
          {{scope.row.numberJoined}}
          <span v-if="scope.row.numberMax > 0"> / {{scope.row.numberMax}}</span>
        </template>
      </el-table-column>   
      <el-table-column label="发布/修改时间" width="160">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}
          <br>
          {{scope.row.dateUpdate ? scope.row.dateUpdate : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
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
  </div>
</template>

<script>
import { fetchDataList, delData } from '@/api/yuyueInfo'
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

      rules: {
        title: [
          { required: true, message: '不能为空'}
        ],
        numberSucccess: [
          { required: true, message: '不能为空'},
          { type:'integer', message: '必须为数字'}
        ],
        numberPersion: [
          { required: true, message: '不能为空'},
          { type:'integer', message: '必须为数字'}
        ],
        timeoutHours: [
          { required: true, message: '不能为空'},
          { type:'integer', message: '必须为数字'}
        ],                
        status: [
          { required: true, message: '不能为空'}
        ],
        refundType: [
          { required: true, message: '不能为空'}
        ],
        dateAddStr: [
          { required: true, message: '不能为空'}
        ],
        dateEndStr: [
          { required: true, message: '不能为空'}
        ],
      },

      searchData:{
        id:undefined,
        goodsId:undefined,
        status:undefined,
        dateAddBegin:undefined,
        dateAddEnd:undefined,
        dateEndBegin:undefined,
        dateEndEnd:undefined,
      },

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        goodsId:undefined,
        numberSucccess:0,
        numberPersion:undefined,
        timeoutHours:24,
        status:undefined,
        refundType:undefined,
        dateAddStr:undefined,
        dateEndStr:undefined
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      statisticsData:{}
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)    
  },
  activated() {
    this.fetchData()
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
      fetchDataList(this.page, this.pageSize, this.searchData).then(response => {
        if (response.code == 0) {
          this.list = response.data.result
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.$router.push({ path: 'add' })
    },
    handleUpdate(id){
      this.$router.push({ path: 'add', query:{id:id} })
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
    statistics(){
      statistics().then(res => {
        // 弹框点击确定调整支付宝付款
        this.statisticsData = res.data
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
    },
    delDataMore(){
      if (!this.multipleSelection.length) {
        Message({
          message: '请先选择需要删除的数据',
          type: 'error',
          duration: 1 * 1000
        })
        return
      }
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.multipleSelection.forEach(obj => {
          delData(obj.id).then(res => {
            this.fetchData()
          })
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
