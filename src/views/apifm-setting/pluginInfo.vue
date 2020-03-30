<template>    
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <el-alert v-if="centerUserBase.vipLevel == 1" type="error" :closable="false" title="插件需要单独购买后方可使用，增值版会员可以免费使用所有插件功能，联系我们 ( 微信 : gooking ) 补差价升级至增值版" style="margin-bottom:20px;" />
    <el-alert v-if="centerUserBase.vipLevel == 2" type="success" :closable="false" title="您当前是增值版本，无需购买即可无障碍使用以下所有插件！" style="margin-bottom:20px;" />
    <div v-if="loadComplete" class="filter-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>小程序好物圈</span>
              <el-button v-if="centerUserBase.vipLevel < 2" style="float: right; padding: 3px 0" type="text" @click="getPayData(1)">开通/续费</el-button>
            </div>
            <div class="text item">微信官方主推 商家引流利器</div>
            <div class="text item"> 298元/年 </div>
            <div class="text item" style="color:red;">{{ fetchDBdata(1) }}</div>
            <div class="text item"><a href="https://www.it120.cc/help/lf8vbn.html" target="_blank">「查看教程」</a></div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>数据推送</span>
              <el-button v-if="centerUserBase.vipLevel < 2" style="float: right; padding: 3px 0" type="text" @click="getPayData(11)">开通/续费</el-button>
            </div>
            <div class="text item">订单、在线支付结果实时推送给你</div>
            <div class="text item"> 199元/年 </div>
            <div class="text item" style="color:red;">{{ fetchDBdata(11) }}</div>
            <div class="text item"><a href="https://www.it120.cc/help/xs7wxm.html" target="_blank">「查看教程」</a></div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>商品自动发货</span>
              <el-button v-if="centerUserBase.vipLevel < 2" style="float: right; padding: 3px 0" type="text" @click="getPayData(10)">开通/续费</el-button>
            </div>
            <div class="text item">卡密/优惠券自动发货</div>
            <div class="text item"> 298元/年 </div>
            <div class="text item" style="color:red;">{{ fetchDBdata(10) }}</div>
            <div class="text item"><a href="https://www.it120.cc/help/gr9bgz.html" target="_blank">「查看教程」</a></div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>三级分销</span>
              <el-button v-if="centerUserBase.vipLevel < 2" style="float: right; padding: 3px 0" type="text" @click="getPayData(3)">开通/续费</el-button>
            </div>
            <div class="text item">三级分销、全面建立销售网络</div>
            <div class="text item"> 298元/年 </div>
            <div class="text item" style="color:red;">{{ fetchDBdata(3) }}</div>
            <div class="text item"><a href="https://www.it120.cc/help/pgfwvu.html" target="_blank">「查看教程」</a></div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top:20px;">        
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>半自动支付宝到账</span>
              <el-button v-if="centerUserBase.vipLevel < 2" style="float: right; padding: 3px 0" type="text" @click="getPayData(4)">开通/续费</el-button>
            </div>
            <div class="text item">免签约 个人支付宝可用</div>
            <div class="text item"> 298元/年 </div>
            <div class="text item" style="color:red;">{{ fetchDBdata(4) }}</div>
            <div class="text item"><a href="https://www.it120.cc/help/sqx1y6.html" target="_blank">「查看教程」</a></div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>钉钉提醒</span>
              <el-button v-if="centerUserBase.vipLevel < 2" style="float: right; padding: 3px 0" type="text" @click="getPayData(5)">开通/续费</el-button>
            </div>
            <div class="text item">订单等消息 多人提醒</div>
            <div class="text item"> 99元/年 </div>
            <div class="text item" style="color:red;">{{ fetchDBdata(5) }}</div>
            <div class="text item"><a href="https://www.it120.cc/help/nmqn8v.html" target="_blank">「查看教程」</a></div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>工作流备忘录</span>
              <el-button v-if="centerUserBase.vipLevel < 2" style="float: right; padding: 3px 0" type="text" @click="getPayData(6)">开通/续费</el-button>
            </div>
            <div class="text item">客服跟踪 服务记录 备忘备注</div>
            <div class="text item"> 99元/年 </div>
            <div class="text item" style="color:red;">{{ fetchDBdata(6) }}</div>
            <div class="text item"><a href="https://www.it120.cc/help/xpc5uo.html" target="_blank">「查看教程」</a></div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>押金管理</span>
              <el-button v-if="centerUserBase.vipLevel < 2" style="float: right; padding: 3px 0" type="text" @click="getPayData(8)">开通/续费</el-button>
            </div>
            <div class="text item">收押金 到期自动退还 手动退还押金</div>
            <div class="text item"> 99元/年 </div>
            <div class="text item" style="color:red;">{{ fetchDBdata(8) }}</div>
            <div class="text item">「开箱即用」</div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top:20px;">        
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>门店/商品分润</span>
              <el-button v-if="centerUserBase.vipLevel < 2" style="float: right; padding: 3px 0" type="text" @click="getPayData(9)">开通/续费</el-button>
            </div>
            <div class="text item">供应商、业务员、门店店长分润</div>
            <div class="text item"> 298元/年 </div>
            <div class="text item" style="color:red;">{{ fetchDBdata(9) }}</div>
            <div class="text item"><a href="https://www.it120.cc/help/qytmng.html" target="_blank">「查看教程」</a></div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>微信小程序直播带货</span>
              <el-button v-if="centerUserBase.vipLevel < 2" style="float: right; padding: 3px 0" type="text" @click="getPayData(12)">开通/续费</el-button>
            </div>
            <div class="text item">配合小程序官方直播功能，实现直播带货</div>
            <div class="text item"> 298元/年 </div>
            <div class="text item" style="color:red;">{{ fetchDBdata(9) }}</div>
            <div class="text item"><a href="https://www.it120.cc/help/ucgcnw.html" target="_blank">「查看教程」</a></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
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
import { buyedPlugins, getPayData } from '@/api/pluginInfo'
import { getVIPPayData } from '@/api/centerUser'
import { mapGetters } from 'vuex'

export default {  
  data() {
    return {
      loadComplete: false,
      page: 1,
      pageSize: 10,
      totalRow: 0,

      list: [],
      listLoading: true,
      dialogTableVisible: false,
      alipayPostData: {}
    }
  },
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  mounted() {
    this.buyedPlugins()
    if (this.$route.query.type) {
      const _type = this.$route.query.type
      if (_type == 2) {
        this.getVIPPayData()
      } else {
        this.getPayData(_type)
      }
    }
  },
  methods: {
    buyedPlugins() {
      this.listLoading = true
      buyedPlugins().then(res => {
        this.listLoading = false
        if (res.code === 0) {
          this.list = res.data
        }
        this.loadComplete = true
      })
    },
    fetchDBdata(type) { // 0 移动客服；1小程序购物单; 2vip ; 3 三级分销；4 支付宝半自动 5 钉钉提醒 6 工作流备忘录
      if (this.centerUserBase.vipLevel === 2 && type !== 2) {
        return '增值版免费'
      }
      let _dbData = this.list.find(ele => {
        return ele.type == type
      })      
      if (!_dbData) {
        return '未开通 / 已过期'
      }
      return '到期日期: ' + _dbData.dateEnd
    },
    getPayData(type) {
      getPayData({
        userId: this.centerUserBase.id,
        type: type
      }).then(res => {
        // 弹框点击确定调整支付宝付款
        if (res.code != 0) {
          this.$message.error(res.msg)
          return
        }
        this.alipayPostData = res.data
        this.dialogTableVisible = true
      })
    },
    getVIPPayData() {
      getVIPPayData(this.centerUserBase.id, 1).then(res => {
        // 弹框点击确定调整支付宝付款
        this.alipayPostData = res.data
        this.dialogTableVisible = true
      })
    }
  }
}
</script>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }
</style>