<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.shopId" placeholder="所属门店">
        <el-option
          v-for="item in shopData"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input clearable @keyup.enter.native="searchBtnClick" style="width: 200px;" class="filter-item" placeholder="用户手机" v-model="searchData.mobile">
      </el-input>
      <el-input clearable @keyup.enter.native="searchBtnClick" style="width: 200px;" class="filter-item" placeholder="用户编号" v-model="searchData.uid">
      </el-input>
      <el-input clearable @keyup.enter.native="searchBtnClick" style="width: 200px;" class="filter-item" placeholder="用户昵称" v-model="searchData.nick">
      </el-input>
      <el-input clearable @keyup.enter.native="searchBtnClick" style="width: 200px;" class="filter-item" placeholder="订单ID" v-model="searchData.id">
      </el-input>
      <el-input clearable @keyup.enter.native="searchBtnClick" style="width: 200px;" class="filter-item" placeholder="订单号" v-model="searchData.orderNumber">
      </el-input>
      <el-input clearable @keyup.enter.native="searchBtnClick" style="width: 200px;" class="filter-item" placeholder="支付单号" v-model="searchData.payNumber">
      </el-input>
      <el-input clearable @keyup.enter.native="searchBtnClick" style="width: 200px;" class="filter-item" placeholder="核销码" v-model="searchData.hxNumber">
      </el-input>
      <el-input clearable @keyup.enter.native="searchBtnClick" style="width: 200px;" class="filter-item" placeholder="商品编号" v-model="searchData.goodsId">
      </el-input>
      <el-input clearable @keyup.enter.native="searchBtnClick" style="width: 200px;" class="filter-item" placeholder="商品名称" v-model="searchData.goodsName">
      </el-input>
      <el-input clearable @keyup.enter.native="searchBtnClick" style="width: 200px;" class="filter-item" placeholder="扩展属性" v-model="searchData.extendKeywords">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.status" placeholder="订单状态">
        <el-option label="订单关闭" value="-1" />
        <el-option label="待支付" value="0" />
        <el-option label="待发货" value="1" />
        <el-option label="已发货待确认" value="2" />
        <el-option label="待评价" value="3" />
        <el-option label="交易成功" value="4" />
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.refundStatus" placeholder="退款状态">
        <el-option label="无退款" value="0" />
        <el-option label="有退款" value="1" />
        <el-option label="退款处理中" value="2" />
        <el-option label="退款成功" value="3" />
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.isNeedLogistics" placeholder="是否需要快递">
        <el-option label="不需要发快递" value="0" />
        <el-option label="需要发快递" value="1" />
      </el-select>
      <el-date-picker type="date" placeholder="交易时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="交易时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="更新时间起" v-model="searchData.dateUpdateBegin" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker type="date" placeholder="更新时间止" v-model="searchData.dateUpdateEnd" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="medium" class="filter-item" type="primary" icon="el-icon-search" @click="searchBtnClick()">搜索</el-button>
      <el-button v-if="hasLingTongMod" size="medium" class="filter-item" type="success" icon="el-icon-printer" @click="goLT">灵通打单</el-button>
      <el-button size="medium" class="filter-item" style="margin-left: 10px;" @click="handleDownload" type="danger" icon="el-icon-download" :loading="downloadLoading">导出Excel</el-button>
      <el-button size="medium" class="filter-item" style="margin-left: 10px;" v-checkBuyedPlugin="[9]" @click="openDown2" type="danger" icon="el-icon-download">导出销售明细</el-button>
    </div>
    <el-alert
      v-if="aggregate"
      :title="aggregate"
      type="success"
      :closable="false">
    </el-alert>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55" row-key="id"></el-table-column>
      <el-table-column label="用户信息">
        <template slot-scope="scope">
          {{apiExtUserMap[scope.row.uid].mobile?apiExtUserMap[scope.row.uid].mobile:'-'}}<br>
          {{apiExtUserMap[scope.row.uid].nick?apiExtUserMap[scope.row.uid].nick:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="商品数/订单号">
        <template slot-scope="scope">
          共{{scope.row.goodsNumber}}件商品<br>
          {{scope.row.orderNumber}}
        </template>
      </el-table-column>
      <el-table-column prop="statusStr" label="状态">
        <template slot-scope="scope">
         {{scope.row.statusStr}}
         <el-button style="color:red" v-if="scope.row.hasRefund" type="text" @click="orderDetail(scope.row.id)">有退款</el-button>
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template slot-scope="scope">
         商品价:{{scope.row.amount}}<br>
         快递费:{{scope.row.amountLogistics?scope.row.amountLogistics:0}}
        </template>
      </el-table-column>
      <el-table-column label="实收">
        <template slot-scope="scope">
         金额:{{scope.row.amountReal}}<br>
         积分:{{scope.row.score?scope.row.score:0}}
        </template>
      </el-table-column>
      <el-table-column label="交易/更新时间" width="160">
        <template slot-scope="scope">
         {{scope.row.dateAdd}}<br>
         {{scope.row.dateUpdate?scope.row.dateUpdate:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%">
        <template slot-scope="scope">
          <el-button type="text" class='delete' @click="orderDetail(scope.row.id)" style="color:#336699">详情</el-button>
          <el-button type="text" class='delete' @click="delOrder(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button size="small" style='margin-top:20px' type="danger" icon="el-icon-delete" @click="delDataMore">批量删除</el-button>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow" style="margin-top:20px;">
    </el-pagination>

    <el-dialog title="导出销售明细" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-position="left">
        <el-form-item>
          <el-col :span="8">
            <el-date-picker v-model="downLoadGoodsSearch.dateBegin" type="date" placeholder="开始日期" value-format="yyyy-MM-dd" />
          </el-col>
          <el-col :span="2" class="orange" style="text-align:center;">至</el-col>
          <el-col :span="8">
            <el-date-picker v-model="downLoadGoodsSearch.dateEnd" type="date" placeholder="截止日期" value-format="yyyy-MM-dd" />
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">
            <el-button :loading="downloadLoading" type="danger" @click="handleDownloadGoodsSale">导出Excel</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchDataList, fetchGoodsSaleList, fetchExpressCompanies, traces, orderDetails, closeOrder, changePrice, changeScore, payOrder, payOrderOff, fahuo, fahuoDada, successOrder, delOrder, orderRefund, goLingTong, orderRefundApplyList } from '@/api/apiExtOrder'
import {fetchShopPageList} from '@/api/apiExtShopSub'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      page:1,
      pageSize:50,
      totalRow:0,

      shopData: [{label: '全部', value: ''},
          {label: '未归属任何店铺', value: 0}],

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
        id: undefined
      },

      downLoadGoodsSearch: {
        dateBegin: undefined,
        dateEnd: undefined
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
      downloadLoading: false,
      statisticsData:{},
      apiExtUserMap:{},
      hasLingTongMod:false,

      checkRefundApply: true
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.getShopData()
  },
  activated() {
    this.fetchData()
  },
  methods: {
    getShopData() {
      fetchShopPageList(1, 10000, {}).then(response => {
        if (response.code === 0) {
          response.data.result.forEach((a) => {
            let v = {};
            v.value = a.id;
            v.label = a.name;
            this.shopData.push(v);
          })
        }
      })
    },
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
    searchBtnClick(){
      this.page = 1;
      this.fetchData();
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      fetchDataList(this.page, this.pageSize, this.searchData).then(response => {
        if (response.code == 0) {
          this.apiExtUserMap = response.data.apiExtUserMap
          this.list = response.data.result
          this.totalRow = response.data.totalRow
          this.hasLingTongMod = response.data.hasLingTongMod
          this.aggregate = `总计 ${response.data.aggregate.count_id} 笔订单，累计销售了 ${response.data.aggregate.sum_goods_number} 件商品，共计销售额为 ${response.data.aggregate.sum_amount_real} 元，退款金额  ${response.data.aggregate.sum_money_refund} 元`
        } else {
          this.list = []
          this.totalRow = 0
          this.aggregate = null
        }
        this.listLoading = false
      })
      // 监测是否有退换货的申请未处理
      if (!this.checkRefundApply) {
        this.checkRefundApply = true
        return
      }
      orderRefundApplyList({
        unResolved: true,
        pageSize: 1
      }).then(res => {
        if (res.code === 0) {
          this.$confirm('有用户发起了售后退换货申请，是否立即前往处理？', '售后申请', {
            confirmButtonText: '立即处理',
            cancelButtonText: '暂不处理',
            type: 'warning'
          }).then(() => {
            this.searchData.id = res.data.result[0].orderId
            this.checkRefundApply = false
            this.fetchData(true)
          })
        }
      })
    },
    goLT(){
      this.listLoading = true
      goLingTong().then(res => {
        this.listLoading = false
        this.$alert('<a href="'+ res.data +'" target="_blank" style="color:red"><点击进入灵通平台></a>', '跳转到灵通打单', {
          dangerouslyUseHTMLString: true,
          showConfirmButton:false,
          center: true
        });
      })
    },
    orderDetail(id){
      this.$router.push({path: '/user/apiExtOrder/detail', query : {id:id}})
    },
    delOrder(id){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delOrder(id).then(res => {
          if (res.code == 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.fetchData()
          } else {
            this.$message.error(res.msg);
          }
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
        this.delDataMoreDone()
      }).catch(() => {});
    },
    async delDataMoreDone(){
      let _index = 1;
      let loadingInstance = this.$loading({
        text: '正在删除...'
      });
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const obj = this.multipleSelection[index];
        await delOrder(obj.id);
        _index++;
      }
      this.$nextTick(() => {
        loadingInstance.close();
      });
      this.fetchData();
    },
    handleDownload() {
      this.downloadLoading = true
      fetchDataList(1, 1000, this.searchData).then(response => {
        if (response.code == 0) {
          let curList = response.data.result
          let apiExtUserMap = response.data.apiExtUserMap
          curList.forEach(ele => {
            if (ele.uid) {
              let userMap = apiExtUserMap[ele.uid]
              if (userMap) {
                ele.mobile = userMap.mobile
                ele.nick = userMap.nick
              }
            }
          })
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['手机号码', '昵称', '订单号', '商品数', '状态', '退款状态', '商品价格', '快递费用', '实收', '消耗积分', '下单时间', '更新时间', '备注']
            const filterVal = ['mobile', 'nick', 'orderNumber', 'goodsNumber', 'statusStr', 'hasRefund', 'amount', 'amountLogistics', 'amountReal', 'score', 'dateAdd', 'dateUpdate', 'remark']
            const data = this.formatJson(filterVal, curList)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '订单管理',
              autoWidth: true
            })
            this.downloadLoading = false
          })
        }
      })
    },
    openDown2() {
      this.pushData.dialogFormVisible = true
    },
    handleDownloadGoodsSale() {
      this.downloadLoading = true
      fetchGoodsSaleList(this.downLoadGoodsSearch).then(response => {
        if (response.code === 700) {
          this.downloadLoading = false
          this.$message.error('暂无销售记录')
          return
        }
        if (response.code === 0) {
          const curList = response.data.result
          console.log('sss:', curList)
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['序号', '日期', '产品名称', '进货价格', '销售价格', '销售数量', '单品利润', '合计毛利', '平台佣金', '业务员提点', '供应商分润']
            const filterVal = ['index', 'dateAddDate', 'goodsName', 'cost', 'amountSingle', 'number', 'dplr', 'hjml', 'benefitFwf', 'benefitSale', 'benefitOther1']
            const data = this.formatJson(filterVal, curList)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '销售明细记录',
              autoWidth: true
            })
            this.downloadLoading = false
          })
        }
      })
    },
    formatJson(filterVal, jsonData) {
      let index = 0
      return jsonData.map(v => filterVal.map(j => {
        if (j == 'index') {
          return ++index
        }
        if (j == 'dplr') {
          const amountSingle = v['amountSingle'] ? v['amountSingle'] : 0
          const cost = v['cost'] ? v['cost'] : 0
          return amountSingle*1 - cost*1
        }
        if (j == 'hjml') {
          const amountSingle = v['amountSingle'] ? v['amountSingle'] : 0
          const cost = v['cost'] ? v['cost'] : 0
          const number = v['number']*1
          return number * (amountSingle*1 - cost*1)
        }
        if (j == 'hasRefund') {
          return v[j] ? '有' : '无'
        }
        if (j == 'dateAddDate') {
          if (!v['dateAdd']) {
            return '-'
          }
          return v['dateAdd'].split(' ')[0]
        }
        return v[j]
      }))
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
