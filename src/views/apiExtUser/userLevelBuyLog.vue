<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户编号" v-model="searchData.uid">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="searchData.mobile">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="昵称" v-model="searchData.nick">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="订单号" v-model="searchData.orderNumber">
      </el-input>
      <el-date-picker type="date" placeholder="交易时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="交易时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="用户编号/订单号">
        <template slot-scope="scope">
          {{ scope.row.uid }}
          <br>
          {{ scope.row.orderNumber }}
        </template>
      </el-table-column>
      <el-table-column label="手机/昵称">
        <template slot-scope="scope">
          {{scope.row.mobile ? scope.row.mobile : '-'}}
          <br>
          {{scope.row.nick ? scope.row.nick : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="money" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="交易时间" prop="dateAdd" width="160" />
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
import { fetchUserLevelBuyLog } from "@/api/userLevelBuyLog";

export default {
  data() {
    return {
      page: 1,
      pageSize: 50,
      totalRow: 0,

      rules: {
        goodReputation: [{ required: true, message: "不能为空" }],
        goodReputationRemark: [{ required: true, message: "不能为空" }]
      },

      searchData: {
        mobile: undefined,
        nick: undefined,
        orderId: undefined,
        orderNumber: undefined,
        goodReputation: undefined
      },

      pushData: {
        dialogTitle: undefined,
        dialogFormVisible: false,

        id: undefined,
        goodReputation: undefined,
        goodReputationRemark: undefined
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      apiExtUserMap: undefined
    };
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData);
  },
  activated() {
    this.fetchData();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchData() {
      this.list = null;
      this.listLoading = true;
      fetchUserLevelBuyLog(this.page, this.pageSize, this.searchData).then(
        response => {
          if (response.code == 0) {
            this.list = response.data.result;
            this.list.forEach(ele => {
              if (ele.uid) {
                let UserMap = response.data.userMap[ele.uid];
                if (UserMap) {
                  ele.mobile = UserMap.mobile;
                  ele.nick = UserMap.nick;
                }
              }
            });
            this.apiExtUserMap = response.data.apiExtUserMap;
            this.totalRow = response.data.totalRow;
          } else {
            this.totalRow = 0;
          }
          this.listLoading = false;
        }
      );
    }
  }
};
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
