<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main />
      <!-- https://www.iconfont.cn/collections/detail?spm=a313x.7781069.0.da5a778a4&cid=1888 -->
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { remindCurIndex, remindReadNext } from '@/api/remind'
import { mapGetters } from 'vuex'
import { getVIPPayData } from '@/api/centerUser'

export default {
  name: 'Layout',
  data() {
    return {
      drawer_vip: false, // 是否显示右侧的抽屉
      drawer_vip1_buy: false, // 是否显示右侧的抽屉
      drawer_spread: false, // 是否显示右侧的抽屉
      curIndex:0,

      alipayPostData:{}
    }
  },
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapGetters([
      'centerUserBase'
    ]),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    remindCurIndex().then(res => {
      if (res.code == 0) {
        this.curIndex = res.data
        this.remindReadNext()
      }
    })
    setTimeout(() => {
      if (!this.centerUserBase.adminCenterUser && this.centerUserBase.vipLevel === 0) {
        this.drawer_vip = true
      }
    }, 2000);
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    remindReadNext () {
      remindReadNext(this.curIndex).then(res => {
        if (res.code == 0) {
          this.curIndex = res.data.index
          // 弹出通知
          if (res.data.mod == 'user') {
            let notifyObj = res.data.o
            if (notifyObj.action == 'reg') {
              let msg = ``
              if (notifyObj.nick) {
                msg += ` 昵称:${notifyObj.nick}`
              }
              if (notifyObj.mobile) {
                msg += ` 手机号码:${notifyObj.mobile}`
              }
              this.$notify({
                title: '新用户注册',
                message: msg,
                duration: 0
              });
            }            
          }
          if (res.data.mod == 'order') {
            let notifyObj = res.data.o
            if (notifyObj.action == 'create') {
              let msg = `订单号：${notifyObj.orderNumber}`
              msg += ` 金额:${notifyObj.amountReal}`
              this.$notify({
                title: '新订单',
                message: msg,
                duration: 0
              });
            }            
            if (notifyObj.action == 'pay') {
              let msg = `订单号：${notifyObj.orderNumber}`
              msg += ` 金额:${notifyObj.amountReal}`
              this.$notify({
                title: '订单已支付',
                message: msg,
                duration: 0
              });
            }
            if (notifyObj.action == 'orderRefundApply') {
              let msg = `金额:${notifyObj.amount}`
              msg += ` 原因:${notifyObj.reason}`
              this.$notify({
                title: '有人申请退换货',
                message: msg,
                duration: 0,
                onClick: () => {
                  this.$router.push({ path: '/user/apiExtOrder/list' })
                }
              })
            }
          }
        }
        setTimeout(() => {
          this.remindReadNext()
        }, 1000)
      })
    },
    getVIPPayData(vipLevel) {
      // 前往开通会员
      // this.drawer_vip = false
      // this.$router.push({ path: '/user/pluginInfo/list', query: {type: 2} })
      getVIPPayData(this.centerUserBase.id, vipLevel).then(res => {
        // 弹框点击确定调整支付宝付款
        this.alipayPostData = res.data
        this.drawer_vip1_buy = true
      })
    },
    goSpreadTeams() {
      this.drawer_spread = false
      this.$router.push({ path: '/user/spread/teams' })
    },
    goSpread() {
      this.drawer_spread = false
      this.$router.push({ path: '/user/centerUserCashLog/list' })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }
  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }
  .mobile .fixed-header {
    width: 100%;
  }

.handle-button {
  position: fixed;
  right: 0px;
  border-radius: 6px 0 0 6px !important;
  width: 48px;
  height: 48px;
  pointer-events: auto;
  cursor: pointer;
  pointer-events: auto;
  font-size: 24px;
  text-align: center;
  color: #fff;
  line-height: 48px;

  i {
    font-size: 24px;
    line-height: 48px;
  }
}
</style>
