import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if `redirect:noRedirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    noKeepAlive: true/false      true为不缓存，否则默认缓存
    isSuperAdmin:true/false      true为仅限主账号（手机号、邮箱）登录授权；子账户不显示该菜单
    hideOnBusinessStyle:['aimingpian']  在开启哪些业务形态的时候隐藏该菜单
  }
 **/
export const constantRouterMap = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/register',
  component: () => import('@/views/login/register'),
  hidden: true
},
{
  path: '/resetpwd',
  component: () => import('@/views/login/resetpwd'),
  hidden: true
},
{
  path: '/modifyMobile',
  component: () => import('@/views/login/modifyMobile'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
},

{
  name: '修改密码',
  path: '/editPwd',
  hidden: true,
  component: Layout,
  meta: {
    title: '修改密码',
    icon: 'setting'
  },
  children: [{
    path: '',
    component: () => import('@/views/editPwd/list')
  }]
},
{
  path: '',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    name: 'dashboard',
    path: 'dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: {
      title: '首页',
      icon: 'home',
      noKeepAlive: true
    }
  }]
},
{
  name: '管理员/权限',
  path: '/user',
  component: Layout,
  redirect: '/user/admin/list',
  meta: {
    title: '管理员/权限',
    icon: 'qx'
  },
  children: [{
    name: '角色管理',
    path: 'roles/list',
    component: () => import('@/views/roles/list'),
    meta: {
      title: '角色管理',
      icon: 'roles'
    }
  },
  {
    name: '添加角色',
    path: 'roles/add',
    component: () => import('@/views/roles/add'),
    meta: {
      title: '添加角色',
      icon: 'roles',
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '管理员列表',
    path: 'admin/list',
    component: () => import('@/views/admin/list'),
    meta: {
      title: '管理员列表',
      icon: 'userList'
    }
  }
  ]
},
{
  name: '系统设置',
  path: '/user',
  component: Layout,
  redirect: '/user/apiExtDfs/list',
  meta: {
    title: '系统设置',
    icon: 'setting'
  },
  children: [
    {
      name: '系统参数',
      path: 'apiExtConfig/list',
      component: () => import('@/views/apiExtConfig/list'),
      meta: {
        title: '系统参数',
        icon: 'setting',
        apiIds: [5]
      }
    },
    {
      name: '邮件网关',
      path: 'set/mail/list',
      component: () => import('@/views/setting/centerUserSetMail'),
      meta: {
        title: '邮件网关',
        icon: 'mail',
        apiIds: [175]
      }
    },
    {
      name: '自定义存储',
      path: 'set/dfsConfig/list',
      component: () => import('@/views/setting/dfsConfig'),
      meta: {
        title: '自定义存储',
        icon: 'setting'
      }
    },
    {
      name: '图片验证码设置',
      path: 'apiExtVerificationPicConfig/list',
      component: () => import('@/views/apiExtVerificationPicConfig/list'),
      meta: {
        title: '图片验证码设置',
        icon: 'yzm',
        apiIds: [21]
      }
    },
    {
      name: '友情链接',
      path: 'apiExtFriendlyPartner/list',
      component: () => import('@/views/apiExtFriendlyPartner/list'),
      meta: {
        title: '友情链接',
        icon: 'yqlj',
        apiIds: [60]
      }
    },
    {
      name: '上传文件管理',
      path: 'apiExtDfs/list',
      component: () => import('@/views/apiExtDfs/list'),
      meta: {
        title: '上传文件管理',
        icon: 'files',
        hideOnBusinessStyle: ['aimingpian']
      }
    },
    {
      name: '在线支付',
      path: 'online-pay/info',
      component: () => import('@/views/setting/online-pay'),
      meta: {
        title: '在线支付',
        icon: 'caiwu',
        apiIds: [30]
      }
    },
    {
      name: 'Banner管理',
      path: 'apiExtBanner/list',
      component: () => import('@/views/apiExtBanner/list'),
      meta: {
        title: 'Banner管理',
        icon: 'banner',
        apiIds: [28]
      }
    },
    {
      name: 'Json接口数据',
      path: 'apiExtJson/list',
      component: () => import('@/views/apiExtJson/list'),
      meta: {
        title: 'Json数据管理',
        icon: 'json',
        apiIds: [56]
      }
    },
    {
      name: '头条抖音小程序',
      path: 'tt/microapp/info',
      component: () => import('@/views/tt/appid-setting'),
      meta: {
        title: '头条抖音小程序',
        icon: 'xcx',
        apiIds: [177]
      }
    },
    {
      name: '模拟接口',
      path: 'mockApi/list',
      component: () => import('@/views/mockApi/list'),
      meta: {
        title: '模拟接口',
        icon: 'api',
        apiIds: [178]
      }
    },
    {
      name: '添加模拟接口',
      path: 'mockApi/add',
      component: () => import('@/views/mockApi/add'),
      meta: {
        title: '添加模拟接口',
        icon: 'api',
        noKeepAlive: true
      },
      hidden: true
    }
  ]
},
{
  name: 'CMS模块',
  path: '/user',
  component: Layout,
  redirect: '/user/apiExtNewsCategory/list',
  meta: {
    title: 'CMS模块',
    icon: 'cms',
    apiIds: [6, 9, 132, 169]
  },
  children: [{
    name: '分类管理',
    path: 'apiExtNewsCategory/list',
    component: () => import('@/views/apiExtNewsCategory/list'),
    meta: {
      title: '分类管理',
      icon: 'category',
      apiIds: [9]
    }
  },
  {
    name: '文章管理',
    path: 'apiExtNews/list',
    component: () => import('@/views/apiExtNews/list'),
    meta: {
      title: '文章管理',
      icon: 'articles',
      apiIds: [9]
    }
  },
  {
    name: '添加文章',
    path: 'apiExtNews/add',
    component: () => import('@/views/apiExtNews/add'),
    meta: {
      title: '添加文章',
      icon: 'articles',
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '留言管理',
    path: 'apiExtComment/list',
    component: () => import('@/views/apiExtComment/list'),
    meta: {
      title: '留言管理',
      icon: 'liuyan',
      apiIds: [15]
    }
  },
  {
    name: '单页管理',
    path: 'apiExtPage/list',
    component: () => import('@/views/apiExtPage/list'),
    meta: {
      title: '单页管理',
      icon: 'page',
      apiIds: [132]
    }
  },
  {
    name: '添加单页',
    path: 'apiExtPage/add',
    component: () => import('@/views/apiExtPage/add'),
    meta: {
      title: '添加单页',
      icon: 'page',
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '公告管理',
    path: 'apiExtNotice/list',
    component: () => import('@/views/apiExtNotice/list'),
    meta: {
      title: '公告管理',
      icon: 'gonggao',
      apiIds: [6]
    }
  },
  {
    name: '添加公告',
    path: 'apiExtNotice/add',
    component: () => import('@/views/apiExtNotice/add'),
    meta: {
      title: '添加公告',
      icon: 'gonggao',
      noKeepAlive: true
    },
    hidden: true
  }
  ]
},
{
  name: '微信设置',
  path: '/user',
  component: Layout,
  redirect: '/user/centerUserWxKey/list',
  meta: {
    title: '微信设置',
    icon: 'wx'
  },
  children: [{
    name: '公众号设置',
    path: 'wx/mp/list',
    component: () => import('@/views/wx/mp-setting'),
    meta: {
      title: '公众号设置',
      icon: 'setting',
      apiIds: [76]
    }
  },
  {
    name: '小程序设置',
    path: 'centerUserWxKey/list',
    component: () => import('@/views/wx/setting'),
    meta: {
      title: '小程序设置',
      icon: 'setting',
      apiIds: [69]
    }
  },
  {
    name: '图片素材管理',
    path: '/user/wx/material/images/list',
    component: () => import('@/views/wx/materia-images.vue'),
    meta: {
      title: '图片素材管理',
      icon: 'dxsz',
      apiIds: [76]
    }
  },
  {
    name: '自动回复',
    path: 'wxAutoReply/list',
    component: () => import('@/views/wx/wxAutoReply'),
    meta: {
      title: '自动回复',
      icon: 'dxsz',
      apiIds: [76]
    }
  },
  {
    name: '服务号菜单',
    path: 'wxMenu/list',
    component: () => import('@/views/wx/wxMenu'),
    meta: {
      title: '服务号菜单',
      icon: 'table',
      apiIds: [76]
    }
  },
  {
    name: '模板[订阅]消息',
    path: 'wxTemplateMsg/list',
    component: () => import('@/views/wx/wxTemplateMsg'),
    meta: {
      title: '模板[订阅]消息',
      icon: 'table',
      apiIds: [69, 76]
    }
  },
  {
    name: '小程序直播间',
    path: 'wxa-live/rooms',
    component: () => import('@/views/wx/liveInfo'),
    meta: {
      title: '小程序直播间',
      icon: 'table',
      apiIds: [179]
    }
  }
  ]
},
{
  name: '用户管理',
  path: '/user',
  component: Layout,
  redirect: '/user/apiExtUser/list',
  meta: {
    title: '用户管理',
    icon: 'user'
  },
  children: [{
    name: '会员等级',
    path: 'apiExtUserLevel/list',
    component: () => import('@/views/apiExtUser/apiExtUserLevel'),
    meta: {
      title: '会员等级',
      icon: 'userlevel',
      apiIds: [25],
      hideOnBusinessStyle: ['noodles']
    }
  },
  {
    name: '用户列表',
    path: 'apiExtUser/list',
    component: () => import('@/views/apiExtUser/list'),
    meta: {
      title: '用户列表',
      icon: 'userList',
      apiIds: [25]
    }
  },
  {
    name: '编辑用户',
    path: 'apiExtUser/add',
    component: () => import('@/views/apiExtUser/add'),
    meta: {
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '收货地址',
    path: 'apiExtUserShippingAddress/list',
    component: () => import('@/views/apiExtUserShippingAddress/list'),
    meta: {
      title: '收货地址',
      icon: 'address',
      apiIds: [50]
    }
  },
  {
    name: '收货地址',
    path: 'apiExtUserShippingAddress/add',
    component: () => import('@/views/apiExtUserShippingAddress/add'),
    meta: {
      noKeepAlive: true
    },
    hidden: true
  }
  ]
},
{
  name: '排队叫号',
  path: '/user',
  component: Layout,
  redirect: '/user/queuingUpType/list',
  meta: {
    title: '排队叫号',
    icon: 'paiduijiaohao',
    apiIds: [82]
  },
  children: [{
    name: '队列维护',
    path: 'queuingUpType/list',
    component: () => import('@/views/queuingUpType/list'),
    meta: {
      title: '队列维护',
      icon: 'paiduijiaohao'
    }
  },
  {
    name: '取号列表',
    path: 'queuingUpLog/list',
    component: () => import('@/views/queuingUpLog/list'),
    meta: {
      title: '取号列表',
      icon: 'jiaohao'
    }
  }
  ]
},
{
  name: '财务管理',
  path: '/user',
  component: Layout,
  redirect: '/user/extDiscountsCoupon/list',
  meta: {
    title: '财务管理',
    icon: 'caiwu'
  },
  children: [{
    name: '优惠券规则',
    path: 'extDiscountsCoupon/list',
    component: () => import('@/views/extDiscountsCoupon/list'),
    meta: {
      title: '优惠券规则',
      icon: 'juan',
      apiIds: [70]
    }
  },
  {
    name: '优惠券动态口令',
    path: 'discountsCouponPwd/list',
    component: () => import('@/views/extDiscountsCoupon/pwd'),
    meta: {
      title: '优惠券动态口令',
      icon: 'password',
      apiIds: [70]
    }
  },
  {
    name: '优惠券规则',
    path: 'extDiscountsCoupon/add',
    component: () => import('@/views/extDiscountsCoupon/add'),
    meta: {
      title: '优惠券规则',
      icon: 'juan',
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '优惠券管理',
    path: 'extDiscountsCouponUser/list',
    component: () => import('@/views/extDiscountsCoupon/extDiscountsCouponUser'),
    meta: {
      title: '优惠券管理',
      icon: 'juan',
      apiIds: [70]
    }
  },
  {
    name: '满减设置',
    path: 'apiExtUserCashPayBillDiscounts/list',
    component: () => import('@/views/apiExtUserCashPayBillDiscounts/list'),
    meta: {
      title: '满减设置',
      icon: 'maidan',
      apiIds: [170]
    }
  },
  {
    name: '用户资产管理',
    path: 'apiExtUserCash/list',
    component: () => import('@/views/apiExtUserCash/list'),
    meta: {
      title: '用户资产管理',
      icon: 'caiwu',
      apiIds: [30, 94, 116]
    }
  },
  {
    name: '充值赠送规则',
    path: 'apiExtUserCashRechargeSend/list',
    component: () => import('@/views/apiExtUserCashRechargeSend/list'),
    meta: {
      title: '充值赠送规则',
      icon: 'caiwu',
      apiIds: [30, 116]
    }
  },
  {
    name: '充值记录',
    path: 'apiExtUserPay/list',
    component: () => import('@/views/apiExtUserPay/list'),
    meta: {
      title: '充值记录',
      icon: 'paylog',
      apiIds: [30, 116]
    }
  },
  {
    name: '资金明细',
    path: 'apiExtUserCashLog/list',
    component: () => import('@/views/apiExtUserCashLog/list'),
    meta: {
      title: '资金明细',
      icon: 'paylog',
      apiIds: [30, 116]
    }
  },
  {
    name: '提现管理',
    path: 'extUserWithdraw/list',
    component: () => import('@/views/extUserWithdraw/list'),
    meta: {
      title: '提现管理',
      icon: 'tixian',
      apiIds: [94]
    }
  },
  {
    name: '支付宝收钱码',
    path: 'alipayTransferQrcode/list',
    component: () => import('@/views/alipayTransferQrcode/list'),
    meta: {
      title: '支付宝收钱码',
      icon: 'alipaySR',
      apiIds: [116]
    }
  },
  {
    name: '支付宝转账记录',
    path: 'alipayTransfer/list',
    component: () => import('@/views/alipayTransfer/list'),
    meta: {
      title: '支付宝转账记录',
      icon: 'alipaySR',
      apiIds: [116]
    }
  },
  {
    name: '发票管理',
    path: 'invoice/list',
    component: () => import('@/views/invoice/list'),
    meta: {
      title: '发票管理',
      icon: 'score',
      apiIds: [172]
    }
  },
  {
    name: '押金管理',
    path: 'deposit/list',
    component: () => import('@/views/deposit/list'),
    meta: {
      title: '押金管理',
      icon: 'yajin',
      apiIds: [173]
    }
  },
  {
    name: '会员购买记录',
    path: 'userLevelBuyLog/list',
    component: () => import('@/views/apiExtUser/userLevelBuyLog'),
    meta: {
      title: '会员购买记录',
      icon: 'paylog',
      apiIds: [25]
    }
  }
  ]
},
{
  name: '积分模块',
  path: '/user',
  component: Layout,
  redirect: '/user/apiExtUserScoreSignRule/list',
  meta: {
    title: '积分模块',
    icon: 'score',
    apiIds: [88, 153]
  },
  children: [
    {
      name: '签到规则',
      path: 'apiExtUserScoreSignRule/list',
      component: () => import('@/views/apiExtUserScoreSignRule/list'),
      meta: {
        title: '签到规则',
        icon: 'scoreSignRule',
        apiIds: [88]
      }
    },
    {
      name: '赠送规则',
      path: 'userScoreSendRule/list',
      component: () => import('@/views/userScoreSendRule/list'),
      meta: {
        title: '赠送规则',
        icon: 'scoreSignRule',
        apiIds: [88]
      }
    },
    {
      name: '积分券',
      path: 'userScoreTicket/list',
      component: () => import('@/views/userScoreTicket/list'),
      meta: {
        title: '积分券',
        icon: 'score',
        apiIds: [153]
      }
    },
    {
      name: '积分兑换',
      path: 'scoreDeductionRule/list',
      component: () => import('@/views/scoreDeductionRule/list'),
      meta: {
        title: '积分兑换',
        icon: 'score',
        apiIds: [88]
      }
    },
    {
      name: '积分明细',
      path: 'apiExtUserScoreLog/list',
      component: () => import('@/views/apiExtUserScoreLog/list'),
      meta: {
        title: '积分明细',
        icon: 'score',
        apiIds: [88]
      }
    },
    {
      name: '成长值明细',
      path: 'growthLog/list',
      component: () => import('@/views/apiExtUserScoreLog/growthLog'),
      meta: {
        title: '成长值明细',
        icon: 'score',
        apiIds: [88]
      }
    }
  ]
},
{
  name: '短信设置',
  path: '/user',
  component: Layout,
  redirect: '/user/apiExtSmsConfig/list',
  meta: {
    title: '短信设置',
    icon: 'dxsz',
    apiIds: [23]
  },
  children: [{
    name: '验证码设置',
    path: 'apiExtSmsConfig/list',
    component: () => import('@/views/apiExtSmsConfig/list'),
    meta: {
      title: '验证码设置',
      icon: 'verificationCode'
    }
  }, {
    name: '验证码设置add',
    path: 'apiExtSmsConfig/add',
    component: () => import('@/views/apiExtSmsConfig/add'),
    meta: {
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '短信记录',
    path: 'logSms/list',
    component: () => import('@/views/logSms/list'),
    meta: {
      title: '短信记录',
      icon: 'sms'
    }
  }
  ]
},
{
  name: '商城管理',
  path: '/user',
  component: Layout,
  redirect: '/user/apiExtShopSub/list',
  meta: {
    title: '商城管理',
    icon: 'shopping'
  },
  children: [{
    name: '门店管理',
    path: 'apiExtShopSub/list',
    component: () => import('@/views/apiExtShopSub/list'),
    meta: {
      title: '门店管理',
      icon: 'shop',
      apiIds: [34]
    }
  },
  {
    name: '门店管理',
    path: 'apiExtShopSub/add',
    component: () => import('@/views/apiExtShopSub/add'),
    meta: {
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '商品分类',
    path: 'apiExtShopGoodsCategory/list',
    component: () => import('@/views/apiExtShopGoodsCategory/list'),
    meta: {
      title: '商品分类',
      icon: 'category',
      apiIds: [36]
    }
  },
  {
    name: '规格尺寸',
    path: 'apiExtShopProperty/list',
    component: () => import('@/views/apiExtShopProperty/list'),
    meta: {
      title: '规格尺寸',
      icon: 'guigecicun',
      apiIds: [37]
    }
  },
  {
    name: '运费模板',
    path: 'apiExtShopFreightTemplate/list',
    component: () => import('@/views/apiExtShopFreightTemplate/list'),
    meta: {
      title: '运费模板',
      icon: 'yunfeimoban',
      apiIds: [37],
      hideOnBusinessStyle: ['noodles']
    }
  },
  {
    name: '添加修改运费模板',
    path: 'apiExtShopFreightTemplate/add',
    component: () => import('@/views/apiExtShopFreightTemplate/add'),
    meta: {
      title: '运费模板',
      icon: 'yunfeimoban',
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '商品管理',
    path: 'apiExtShopGoods/list',
    component: () => import('@/views/apiExtShopGoods/list'),
    meta: {
      title: '商品管理',
      icon: 'goods',
      apiIds: [37]
    }
  },
  {
    name: '商品管理',
    path: 'apiExtShopGoods/add',
    component: () => import('@/views/apiExtShopGoods/add'),
    meta: {
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '每日定价',
    path: 'apiExtShopGoods/dayPrice',
    component: () => import('@/views/apiExtShopGoods/dayPrice'),
    meta: {
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '会员限购',
    path: 'apiExtShopGoods/limitation',
    component: () => import('@/views/apiExtShopGoods/limitation'),
    meta: {
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '分润设置',
    path: 'apiExtShopGoods/benefit',
    component: () => import('@/views/apiExtShopGoods/benefit'),
    meta: {
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '卡密自动发货',
    path: 'apiExtShopGoods/coupon',
    component: () => import('@/views/apiExtShopGoods/coupon'),
    meta: {
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '订单列表',
    path: 'apiExtOrder/list',
    component: () => import('@/views/apiExtOrder/list'),
    meta: {
      title: '订单管理',
      icon: 'order',
      apiIds: [41]
    }
  },
  {
    name: '订单详情',
    path: 'apiExtOrder/detail',
    component: () => import('@/views/apiExtOrder/detail'),
    meta: {
      title: '订单管理',
      icon: 'order',
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '评价管理',
    path: 'apiExtOrderEvaluate/list',
    component: () => import('@/views/apiExtOrderEvaluate/list'),
    meta: {
      title: '评价管理',
      icon: 'pingjia',
      apiIds: [41],
      hideOnBusinessStyle: ['noodles']
    }
  },
  {
    name: '达达门店',
    path: 'expressDadaShopCitycode/list',
    component: () => import('@/views/expressDadaShopCitycode/list'),
    meta: {
      title: '达达门店',
      icon: 'dada',
      apiIds: [111]
    }
  },
  {
    name: '知识交易设置',
    path: 'virtualTraderSet/list',
    component: () => import('@/views/virtualTraderSet/list'),
    meta: {
      title: '知识交易设置',
      icon: 'zhishi',
      apiIds: [128]
    }
  },
  {
    name: '添加知识交易',
    path: 'virtualTraderSet/add',
    component: () => import('@/views/virtualTraderSet/add'),
    meta: {
      title: '知识交易',
      icon: 'zhishi',
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '知识交易记录',
    path: 'virtualTraderBuyLog/list',
    component: () => import('@/views/virtualTraderBuyLog/list'),
    meta: {
      title: '知识交易记录',
      icon: 'zhishi',
      apiIds: [128]
    }
  }
  ]
},
{
  name: '支付宝小程序',
  path: '/user',
  component: Layout,
  redirect: '/user/centerUserAliappKey/list',
  meta: {
    title: '支付宝小程序',
    icon: 'alipaySR',
    apiIds: [166]
  },
  children: [{
    name: 'Appid配置',
    path: 'centerUserAliappKey/list',
    component: () => import('@/views/centerUserAliappKey/list'),
    meta: {
      title: '支付宝小程序',
      icon: 'alipaySR'
    }
  }]
},

{
  name: '视频点播',
  path: '/user',
  component: Layout,
  children: [{
    path: 'apiExtVod/list',
    name: '视频点播',
    component: () => import('@/views/apiExtVod/list'),
    meta: {
      title: '视频点播',
      icon: 'video',
      apiIds: [101]
    }
  }]
},
{
  name: '预约报名',
  path: '/user',
  component: Layout,
  redirect: '/user/yuyueInfo/list',
  meta: {
    title: '预约报名',
    icon: 'yuyue',
    apiIds: [158]
  },
  children: [{
    name: '项目设置',
    path: 'yuyueInfo/list',
    component: () => import('@/views/yuyueInfo/list'),
    meta: {
      title: '项目设置',
      icon: 'yuyue'
    }
  },
  {
    name: '添加预约报名项目',
    path: 'yuyueInfo/add',
    component: () => import('@/views/yuyueInfo/add'),
    meta: {
      title: '添加预约报名项目',
      icon: 'yuyue',
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '预约记录',
    path: 'yuyueJoin/list',
    component: () => import('@/views/yuyueJoin/list'),
    meta: {
      title: '预约记录',
      icon: 'yuyue'
    }
  }
  ]
},
{
  name: '投票管理',
  path: '/user',
  component: Layout,
  redirect: '/user/voteInfo/list',
  meta: {
    title: '投票管理',
    icon: 'toupiao',
    apiIds: [174]
  },
  children: [{
    name: '项目设置',
    path: 'voteInfo/list',
    component: () => import('@/views/voteInfo/list'),
    meta: {
      title: '项目设置',
      icon: 'setting'
    }
  },
  {
    name: '添加投票项目',
    path: 'voteInfo/add',
    component: () => import('@/views/voteInfo/add'),
    meta: {
      title: '添加投票项目',
      icon: 'setting',
      noKeepAlive: true
    },
    hidden: true
  },
  {
    name: '投票记录',
    path: 'voteJoin/joinLogs',
    component: () => import('@/views/voteInfo/joinLogs'),
    meta: {
      title: '投票记录',
      icon: 'articles'
    }
  }
  ]
},
{
  name: '营销辅助',
  path: '/user',
  component: Layout,
  redirect: '/user/kanjiaSet/list',
  meta: {
    title: '营销辅助',
    icon: 'yingxiao'
  },
  children: [{
    name: '砍价设置',
    path: 'kanjiaSet/list',
    component: () => import('@/views/kanjiaSet/list'),
    meta: {
      title: '砍价设置',
      icon: 'kanjia',
      apiIds: [122]
    }
  },
  {
    name: '发起砍价',
    path: 'kanjiaJoiner/list',
    component: () => import('@/views/kanjiaJoiner/list'),
    meta: {
      title: '发起砍价',
      icon: 'kanjia',
      apiIds: [122]
    }
  },
  {
    name: '砍价助力',
    path: 'kanjiaHelp/list',
    component: () => import('@/views/kanjiaHelp/list'),
    meta: {
      title: '砍价助力',
      icon: 'kanjia',
      apiIds: [122]
    }
  },
  {
    name: '拼团设置',
    path: 'pingtuanSet/list',
    component: () => import('@/views/pingtuanSet/list'),
    meta: {
      title: '拼团设置',
      icon: 'pingtuan',
      apiIds: [134]
    }
  },
  {
    name: '开团记录',
    path: 'pingtuanOpener/list',
    component: () => import('@/views/pingtuanOpener/list'),
    meta: {
      title: '开团记录',
      icon: 'pingtuan',
      apiIds: [134]
    }
  },
  {
    name: '拼团记录',
    path: 'pingtuanHelp/list',
    component: () => import('@/views/pingtuanHelp/list'),
    meta: {
      title: '拼团记录',
      icon: 'pingtuan',
      apiIds: [134]
    }
  },
  {
    name: '抽奖设置',
    path: 'luckyInfo/list',
    component: () => import('@/views/luckyInfo/list'),
    meta: {
      title: '抽奖设置',
      icon: 'choujian',
      apiIds: [168]
    }
  },
  {
    name: '抽奖记录',
    path: 'luckyInfoJoinLog/list',
    component: () => import('@/views/luckyInfo/log'),
    meta: {
      title: '抽奖记录',
      icon: 'choujian',
      apiIds: [168]
    }
  }
  ]
},
{
  name: '分销管理',
  path: '/user',
  component: Layout,
  redirect: '/user/saleDistributionSet/info',
  meta: {
    title: '分销管理',
    icon: 'fx',
    apiIds: [167]
  },
  children: [{
    name: '分销设置',
    path: 'saleDistributionSet/info',
    component: () => import('@/views/saleDistributionSet/list'),
    meta: {
      title: '分销设置',
      icon: 'kanjia'
    }
  },
  {
    name: '申请审核',
    path: 'saleDistributionApply/list',
    component: () => import('@/views/saleDistributionApply/list'),
    meta: {
      title: '申请审核',
      icon: 'fx'
    }
  },
  {
    name: '用户关系管理',
    path: 'apiExtUserInviter/list',
    component: () => import('@/views/apiExtUserInviter/list'),
    meta: {
      title: '用户关系管理',
      icon: 'userList'
    }
  },
  {
    name: '佣金记录',
    path: 'saleDistributionCommisionLog/list',
    component: () => import('@/views/saleDistributionCommisionLog/list'),
    meta: {
      title: '佣金记录',
      icon: 'paylog'
    }
  }
  ]
},
{
  name: '名片管理',
  path: '',
  component: Layout,
  meta: {
    title: '名片管理',
    icon: 'card',
    apiIds: [169]
  },
  redirect: '/user/aicard/wxset',
  children: [
    {
      name: '小程序设置',
      path: '/user/aicard/wxset',
      component: () => import('@/views/aicard/wxset'),
      meta: {
        title: '小程序设置',
        icon: 'setting'
      }
    },
    {
      name: '产品管理',
      path: '/user/aicard/prolist',
      component: () => import('@/views/aicard/prolist'),
      meta: {
        title: '产品管理',
        icon: 'shopping'
      }
    },
    {
      name: '内容管理',
      path: '/user/aicard/newsedit',
      component: () => import('@/views/aicard/newsedit'),
      meta: {
        title: '内容管理',
        noKeepAlive: true
      },
      hidden: true
    },
    {
      name: '动态管理',
      path: '/user/aicard/newslist',
      component: () => import('@/views/aicard/newslist'),
      meta: {
        title: '动态管理',
        icon: 'articles'
      }
    },
    {
      name: '名片管理',
      path: 'aicard/list',
      component: () => import('@/views/aicard/list'),
      meta: {
        title: '名片管理',
        icon: 'mp'
      }
    },
    {
      name: '名片编辑',
      path: 'aicard/add',
      component: () => import('@/views/aicard/add'),
      meta: {
        title: '名片编辑',
        icon: 'mp',
        noKeepAlive: true
      },
      hidden: true
    },
    {
      name: '访客管理',
      path: 'aicard/listfk',
      component: () => import('@/views/aicard/listfk'),
      meta: {
        title: '访客管理',
        icon: 'userList'
      }
    }
  ]
},
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
