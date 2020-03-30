<template>
  <div class="app-container">
    <el-row v-if="centerUserCash" :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="caiwu" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">可用余额</div>
            <count-to :start-val="0" :end-val="centerUserCash.balance" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="tixian" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">冻结金额</div>
            <count-to :start-val="0" :end-val="centerUserCash.freeze" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="score" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">累计佣金</div>
            <count-to :start-val="0" :end-val="centerUserCash.spreadTotle" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-alert
      v-if="centerUserCash.alipay"
      :title="'您已绑定支付宝: ' + centerUserCash.alipay + ' 可用余额可随时提现至该支付宝账户。'"
      type="success"
      :closable="false"
      effect="dark">
    </el-alert>
    <el-divider>查询账务明细</el-divider>
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="备注" v-model="searchData.remarkLike">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.behavior" placeholder="收/支">
        <el-option label="收入" value="0"></el-option>
        <el-option label="支出" value="1"></el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.type" placeholder="交易类型">
        <el-option label="充值" value="0"></el-option>
        <el-option label="返佣" value="1"></el-option>
        <el-option label="提现" value="2"></el-option>
        <el-option label="购买插件" value="3"></el-option>
      </el-select>
      <el-date-picker type="date" placeholder="交易时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="交易时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button size="medium" class="filter-item" type="danger" icon="el-icon-coin" @click="recharge">充值</el-button>
      <el-button v-if="!centerUserCash.alipay" size="medium" class="filter-item" type="danger" icon="el-icon-coin" @click="bindAlipay">绑定提现支付宝</el-button>
      <el-button v-else size="medium" class="filter-item" type="danger" icon="el-icon-coin" @click="applyAmount">提现</el-button>
    </div>
    
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="收/支" width="200">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.behavior == 0">收入</el-tag>
          <el-tag type="danger" v-if="scope.row.behavior == 1">支出</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="交易类型">
        <template slot-scope="scope">
          {{scope.row.typeStr}}
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="amount" />
      <el-table-column label="剩余可用余额" prop="balance" />
      <el-table-column label="剩余冻结余额" prop="freeze" />
      <el-table-column label="交易时间" prop="dateAdd" width="160" />
      <el-table-column label="备注" prop="remark" />
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


    <el-dialog title="确认付款信息" :visible.sync="dialogTableVisible" width="500px" :close-on-click-modal="false" :close-on-press-escape="false" :center="true">
      <form v-if="alipayPostData && alipayPostData.params" :action="alipayPostData.gateway" method="POST" target="_blank">
        <input type="hidden" v-for="(v, k) in alipayPostData.params" v-bind:key="k" :name="k" :value="v" />
        <div style="line-height:30px;margin-bottom:10px;">
          <div><b>订单号:</b> {{ alipayPostData.params.out_trade_no }}</div>
          <div><b>付款信息:</b> {{ alipayPostData.params.subject }}</div>
          <div><b>金额:</b> {{ alipayPostData.params.total_fee }}</div>
          <div style="margin-top:10px;color:red;text-align:center;"><b>支付完成后，请退出后台重新登录</b></div>
        </div>
        <div style="text-align:center;">
          <el-button type="success" native-type="submit" round>立即前往支付宝支付</el-button>
        </div>
      </form>
    </el-dialog>
  </div>
</template>

<script>
import { bindAlipay, applyAmount } from '@/api/spread'
import { fetchDataList, recharge } from '@/api/centerUserCashLog'
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
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
      centerUserCash: undefined,

      dialogTableVisible: false,
      alipayPostData: {}
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    bindAlipay() {
      this.$prompt('请输入支付宝账号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        bindAlipay(value).then((res) => {
          if (res.code === 0) {
            this.$message({
              message: '设置成功',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    applyAmount() {
      this.$prompt('请输入提现金额', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        applyAmount(value).then((res) => {
          if (res.code === 0) {
            this.$message({
              message: '申请成功，款项将在 1-2 工作日到账，请注意查收！',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
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
            this.centerUserCash = response.data.centerUserCash;
            this.totalRow = response.data.totalRow;
          } else {
            this.totalRow = 0;
          }
          this.listLoading = false;
        }
      );
    },
    recharge(){
      this.$prompt('请输入金额', '充值', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        recharge(value).then(res => {
          // 弹框点击确定调整支付宝付款
          if (res.code != 0) {
            this.$message.error(res.msg)
            return
          }
          this.alipayPostData = res.data;
          this.dialogTableVisible = true;
        })
        // this.$message({
        //   type: 'success',
        //   message: '你的邮箱是: ' + value
        // });
      })
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
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
