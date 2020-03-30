<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="抽奖项目id" v-model="searchData.lid">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户编号" v-model="searchData.uid">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="抽奖号码" v-model="searchData.number">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.isAward" placeholder="是否中奖">
        <el-option label="中奖" value="true"></el-option>
        <el-option label="未中奖" value="false"></el-option>
      </el-select>
      <el-date-picker type="date" placeholder="抽奖时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="抽奖时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="用户编号/昵称">
        <template slot-scope="scope">
          {{scope.row.uid}}
          <br>
          {{scope.row.nicks ? scope.row.nicks : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img v-if="scope.row.avatarUrls" :src="scope.row.avatarUrls" style="width:70px;" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="抽奖项目ID" prop="lid" />
      <el-table-column label="抽奖号码" prop="number" />
      <el-table-column label="中奖" width="200">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isAward">中奖</el-tag>
          <el-tag type="danger" v-if="!scope.row.isAward">未中奖</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="抽奖时间" prop="dateAdd" width="160" />
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
import { fetchDataList } from '@/api/luckyInfoJoinLog'
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
      pageSize:50,
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
      listLoading: true
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
        } else {
          this.totalRow = 0
        }
        this.listLoading = false
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
