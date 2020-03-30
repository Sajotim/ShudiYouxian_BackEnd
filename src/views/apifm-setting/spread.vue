<template>
  <div class="app-container">    
    <div class="filter-container">
      <el-select v-model="searchData.level" clearable style="width: 200px" class="filter-item" placeholder="团队级别">
        <el-option label="直接下属" value="1"></el-option>
        <el-option label="间接下属" value="2"></el-option>
      </el-select>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>    
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row empty-text="您正在单打独斗,赶紧招募团队吧~" @selection-change="handleSelectionChange">
      <el-table-column label="团队级别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level == 1" type="success">直接下属</el-tag>
          <el-tag v-if="scope.row.level == 2" type="danger">间接下属</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="nicks" />
      <el-table-column label="账号" prop="mobileMasks" />
      <el-table-column label="加入时间" prop="dateAdd" width="160" />
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
import { teams, recharge } from '@/api/spread'

export default {
  data() {
    return {
      page: 1,
      pageSize: 50,
      totalRow: 0,

      rules: {
        goodReputation: [{ required: true, message: '不能为空' }],
        goodReputationRemark: [{ required: true, message: '不能为空' }]
      },

      searchData: {
        level: undefined
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
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
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
      teams(this.page, this.pageSize, this.searchData).then(
        response => {
          if (response.code === 0) {
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
    recharge() {
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
