<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户编号" v-model="searchData.uid">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="searchData.mobile">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="昵称" v-model="searchData.nick">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.behavior" placeholder="收/支">
        <el-option label="收入" value="0" />
        <el-option label="支出" value="1" />
      </el-select>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="业务订单号" v-model="searchData.orderId">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.type" placeholder="交易类型">
        <el-option label="充值" value="0" />
        <el-option label="充值赠送" value="9" />
        <el-option label="提现申请" value="11" />
        <el-option label="提现失败" value="12" />
        <el-option label="提现成功" value="1" />
        <el-option label="支付订单" value="2" />
        <el-option label="知识付费" value="5" />
        <el-option label="退款" value="3" />
        <el-option label="预约报名" value="4" />
        <el-option label="分销返佣" value="6" />
        <el-option label="商品邀请奖励" value="7" />
        <el-option label="买单" value="8" />
        <el-option label="押金" value="100" />
        <el-option label="押金(退还)" value="101" />
        <el-option label="购买会员" value="110" />
        <el-option label="货款" value="120" />
        <el-option label="分润" value="130" />
        <el-option label="积分兑换成金额" value="140" />
      </el-select>
      <el-date-picker type="date" placeholder="交易时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="交易时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="用户编号" prop="uid" />
      <el-table-column label="手机/昵称">
        <template slot-scope="scope">
          {{scope.row.mobile ? scope.row.mobile : '-'}}
          <br>
          {{scope.row.nick ? scope.row.nick : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="收/支" width="200">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.behavior == 0">收入</el-tag>
          <el-tag type="danger" v-if="scope.row.behavior == 1">支出</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="交易类型">
        <template slot-scope="scope">
          {{scope.row.typeStr}}
          <el-popover
            v-if="scope.row.remark"
            placement="top-start"
            title="备注"
            width="200"
            trigger="hover"
            :content="scope.row.remark">
            <i slot="reference" class="el-icon-info"></i>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="amount" />
      <el-table-column label="剩余可用余额" prop="balance" />
      <el-table-column label="剩余冻结余额" prop="freeze" />
      <el-table-column label="业务编号" prop="orderId" />
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
import { fetchDataList } from "@/api/apiExtUserCashLog";
import { Message, MessageBox } from "element-ui";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["centerUserBase"])
  },
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
      fetchDataList(this.page, this.pageSize, this.searchData).then(
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
