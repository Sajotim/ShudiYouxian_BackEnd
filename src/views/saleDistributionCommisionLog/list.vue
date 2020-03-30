<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="订单编号" v-model="searchData.orderId">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="收入用户编号" v-model="searchData.uidm">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="收入手机号码" v-model="searchData.mobilem">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="收入昵称" v-model="searchData.nickm">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="消费用户编号" v-model="searchData.uids">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="消费手机号码" v-model="searchData.mobiles">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="消费昵称" v-model="searchData.nicks">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.unit" placeholder="返佣类型">
        <el-option label="现金返佣" value="0"></el-option>
        <el-option label="积分返佣" value="1"></el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.level" placeholder="用户关系">
        <el-option label="一级代理" value="1"></el-option>
        <el-option label="二级代理" value="2"></el-option>
        <el-option label="三级代理" value="3"></el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.isSettlement" placeholder="是否结算">
        <el-option label="已结算" value="true"></el-option>
        <el-option label="未结算" value="false"></el-option>
      </el-select>
      <el-date-picker type="date" placeholder="返佣时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="返佣时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="订单编号" prop="orderId" />
      <el-table-column label="收入用户/手机/昵称">
        <template slot-scope="scope">
          {{scope.row.uidm}}
          <br>
          {{scope.row.mobilem ? scope.row.mobilem : '-'}}
          <br>
          {{scope.row.nickm ? scope.row.nickm : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="消费用户/手机/昵称">
        <template slot-scope="scope">
          {{scope.row.uids}}
          <br>
          {{scope.row.mobiles ? scope.row.mobiles : '-'}}
          <br>
          {{scope.row.nicks ? scope.row.nicks : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="比例" width="200">
        <template slot-scope="scope">
          {{scope.row.bili}}%
        </template>
      </el-table-column>
      <el-table-column label="佣金" width="200">
        <template slot-scope="scope">
          {{scope.row.money}} {{scope.row.unit == 0 ? '元' : '积分'}}
        </template>
      </el-table-column>
      <el-table-column label="关系" width="200">
        <template slot-scope="scope">
          {{scope.row.level}}级代理
        </template>
      </el-table-column>
      <el-table-column label="结算状态" width="200">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isSettlement">已结算</el-tag>
          <el-tag type="danger" v-if="!scope.row.isSettlement">未结算</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="添加/结算时间" width="160">
        <template slot-scope="scope">
          {{scope.row.dateAdd}}<br>{{scope.row.dateSettlement?scope.row.dateSettlement:'-'}}
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
import { fetchDataList } from '@/api/saleDistributionCommisionLog'
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
          this.list.forEach(ele => {
            if (ele.uidm) {
              let UserMapm = response.data.userMapm[ele.uidm]
              if (UserMapm) {
                ele.mobilem = UserMapm.mobile
                ele.nickm = UserMapm.nick
              }
            }            
            if (ele.uids) {
              let UserMaps = response.data.userMaps[ele.uids]
              if (UserMaps) {
                ele.mobiles = UserMaps.mobile
                ele.nicks = UserMaps.nick
              }
            }            
          })
          this.totalRow = response.data.totalRow
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
