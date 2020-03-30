<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户手机" v-model="searchData.mobileUser" />
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户昵称" v-model="searchData.nick" />
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="优惠券类型" v-model="searchData.type" />
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="使用对象" v-model="searchData.refId" />
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="优惠券名称" v-model="searchData.nameLike" />
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="使用订单号" v-model="searchData.orderId" />
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="状态">
        <el-option label="正常" value="0"></el-option>
        <el-option label="失效" value="1"></el-option>
        <el-option label="过期/结束" value="2"></el-option>
        <el-option label="已使用" value="3"></el-option>
      </el-select>
      <el-date-picker type="date" placeholder="领取时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-date-picker type="date" placeholder="领取时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-date-picker type="date" placeholder="更新时间起" v-model="searchData.dateUpdateBegin" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-date-picker type="date" placeholder="更新时间止" v-model="searchData.dateUpdateEnd" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55" row-key="id"></el-table-column>
      <el-table-column label="用户手机/昵称">
        <template slot-scope="scope">
         {{scope.row.mobile?scope.row.mobile:'-'}}
         <br>
         {{scope.row.nick?scope.row.nick:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="类型/对象" width="100%">
        <template slot-scope="scope">
         {{scope.row.type?scope.row.type:'-'}}
         <br>
         {{scope.row.refId?scope.row.refId:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="名称/条件">
        <template slot-scope="scope">
         {{scope.row.name}}
         <br>
         <span v-if="scope.row.moneyHreshold == 0" style="color:green">无条件使用</span>
         <span v-else style="color:red">消费满 {{scope.row.moneyHreshold}} 可用</span>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="金额" width="100%"></el-table-column>
      <el-table-column label="状态" width="100%">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 0">正常</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 1">失效</el-tag>
          <el-tag type="info" v-if="scope.row.status == 2">已过期/结束</el-tag>
          <el-tag type="warning" v-if="scope.row.status == 3">已使用 (订单号：{{scope.row.orderId}}))</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="领取/使用" width="160">
        <template slot-scope="scope">
         {{scope.row.dateAdd}}
         <br>
         {{scope.row.dateUse?scope.row.dateUse:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="生效/截止" width="160">
        <template slot-scope="scope">
         {{scope.row.dateStart?scope.row.dateStart:'-'}}
         <br>
         {{scope.row.dateEnd?scope.row.dateEnd:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" type="text" @click="invalidData(scope.row.id)">作废</el-button>
          <el-button type="text" @click="deleteData(scope.row.id)" style="color:red;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button style='margin-top:20px' type="danger" size="mini" @click="delDataBatch()">批量删除</el-button>
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
import { fetchDataList, invalidData, deleteData } from '@/api/extDiscountsCouponUser'
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
        goodsId: [
          { required: true, message: '不能为空'},
          { type:'integer', message: '必须为数字'}
        ],
        number: [
          { required: true, message: '不能为空'},
          { type:'integer', message: '必须为数字'}
        ],
        originalPrice: [
          { required: true, message: '不能为空'},
          { type:'number', message: '必须为数字'}
        ],
        minPrice: [
          { required: true, message: '不能为空'},
          { type:'number', message: '必须为数字'}
        ],
        helpPriceMin: [
          { required: true, message: '不能为空'},
          { type:'number', message: '必须为数字'}
        ],
        helpPriceMax: [
          { required: true, message: '不能为空'},
          { type:'number', message: '必须为数字'}
        ],
        status: [
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
        kjId:undefined,
        goodsId:undefined,
        mobileUser:undefined,
        nick:undefined,
        status:undefined,
        dateAddBegin:undefined,
        dateAddEnd:undefined,
        dateUpdateBegin:undefined,
        dateUpdateEnd:undefined,
      },

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        goodsId:undefined,
        number:undefined,
        originalPrice:undefined,
        minPrice:undefined,
        helpPriceMin:undefined,
        helpPriceMax:undefined,
        status:undefined,
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
          this.list.forEach(ele => {
            let userMap = response.data.userMap[ele.uid]
            if (userMap) {
              ele.mobile = userMap.mobile
              ele.nick = userMap.nick
            }
          })
        }
        this.listLoading = false
      })
    },
    invalidData(id) {
      this.$confirm('确认要作废本张优惠券吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        invalidData(id).then(res => {
          this.$message({
            message: '作废成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {});
    },
    deleteData(id) {
      this.$confirm('确认要删除本张优惠券吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(id).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {})
    },
    delDataBatch() {
      if (!this.multipleSelection.length) {
        this.$message.error('请先选择需要删除的数据')
        return
      }
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delDataBatchDone()
      }).catch(() => {})
    },
    async delDataBatchDone() { // 批量删除商品
      let _index = 1
      let loadingInstance = this.$loading({
        text: '正在删除 ' + _index + '/' + this.multipleSelection.length + '条数据...'
      })
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const obj = this.multipleSelection[index]
        await deleteData(obj.id)
        _index++
        loadingInstance.close();
        loadingInstance = this.$loading({
          text: '正在删除 ' + _index + '/' + this.multipleSelection.length + '条数据...'
        })
      }
      this.$nextTick(() => {
        loadingInstance.close()
      })
      this.fetchData()
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
