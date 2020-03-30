<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.typeId" placeholder="叫号队列">
        <el-option v-for="item in queuingUpTypeList" :label="item.name" :value="item.id" :key="item.id" />
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="排队中" value="0"></el-option>
        <el-option label="受理中" value="1"></el-option>
        <el-option label="已处理" value="2"></el-option>
        <el-option label="已过号" value="3"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="手机/昵称">
        <template slot-scope="scope">
          {{scope.row.mobileR ? scope.row.mobileR : '-'}}
          <br>
          {{scope.row.nick ? scope.row.nick : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="队列" prop="typeName" />
      <el-table-column label="号码" prop="number" />
      <el-table-column label="预留手机" prop="mobile" />
      <el-table-column label="服务窗口" prop="serviceWindow" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status == 0">排队中</el-tag>
          <el-tag type="warning" v-if="scope.row.status == 1">受理中</el-tag>
          <el-tag type="success" v-if="scope.row.status == 2">已处理</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 3">已过号</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="取号/更新时间" width="160">
        <template slot-scope="scope">
         {{scope.row.dateAdd}}<br>
         {{scope.row.dateUpdate?scope.row.dateUpdate:'-'}}
        </template>
      </el-table-column>      
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status != 1" type="text" style="color:green" @click="successData(scope.row.id)">完成</el-button>
          <el-button v-if="scope.row.status != 1" type="text" style="color:red" @click="skipData(scope.row.id)">过号</el-button>
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
import { fetchDataList, successData, skipData } from '@/api/queuingUpLog'
import { fetchQueuingUpTypeList } from '@/api/queuingUpType'
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
        goodReputation: [
          { required: true, message: '不能为空'},
        ],
        goodReputationRemark: [
          { required: true, message: '不能为空'},
        ],
      },

      searchData:{
        mobile:undefined,
        nick:undefined,
        orderId:undefined,
        orderNumber:undefined,
        goodReputation:undefined,
      },

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        goodReputation:undefined,
        goodReputationRemark:undefined,
      },

      multipleSelection: [],
      list: null,
      queuingUpTypeList:[],
      listLoading: true,
      apiExtUserMap:undefined
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.fetchData()
  },
  activated() {
    fetchQueuingUpTypeList(1, 10000, {}).then(response => {
      if (response.code == 0) {
        this.queuingUpTypeList = response.data.result        
      }
    })
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
        this.totalRow = 0
        if (response.code == 0) {
          this.list = response.data.result
          this.list.forEach(ele => {
            if (ele.uid) {
              let UserMap = response.data.userMap[ele.uid]
              if (UserMap) {
                ele.mobileR = UserMap.mobile
                ele.nick = UserMap.nick
              }
              let queuingUpType = response.data.queuingUpTypeMap[ele.typeId]
              if (queuingUpType) {
                ele.typeName = queuingUpType.name ? queuingUpType.name : '-'
              }
            }            
          })
          this.apiExtUserMap = response.data.apiExtUserMap
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '增加评价'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdate(id, goodReputation, goodReputationRemark){
      this.pushData = Object.assign({}, this.pushDataTmp, {id:id, goodReputation:'' + goodReputation, goodReputationRemark:goodReputationRemark})
      this.pushData.dialogTitle = '修改评价'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
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
    successData(id){
      this.$confirm('确定要把该号子设置为已服务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        successData(id).then(res => {
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
    skipData(id){
      this.$confirm('确定要把该号子设置为已过号吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        skipData(id).then(res => {
          Message({
            message: '操作成功',
            type: 'success',
            duration: 1 * 1000
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
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
