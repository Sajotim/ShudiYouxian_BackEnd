import 'babel-polyfill'
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import { getInfo } from '@/api/login'
import { myInstallApiList } from '@/api/centerUserApi'
import { buyedPlugins } from '@/api/pluginInfo'

Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// Vue.prototype.tinymceUploadUrls = [] 原型变量，不是全局变量
window.tinymceUploadUrls = []
window.isSubAdmin = true // 当前登录用户是否为子账户
window.isSupperAdmin = false // 当前登录用户是否超级管理员
window.myActionsUrls = ['/', '/user', '/dashboard'] // 我的权限URLS
window.myApiIds = [] // 安装的模块编号
window.buyedPlugin = [] // 部署的插件
window.loginedUserInfo = undefined // 当前登录用户信息

async function initData() { // 初始化数据
  const userInfo = await getInfo()
  if (userInfo.code === 0) {
    window.loginedUserInfo = userInfo.data
  }
  const myInstallApiRes = await myInstallApiList(1, 10000, { isUse: true })
  if (!window.loginedUserInfo) {
    myInstallApiRes.data.result.forEach(ele => {
      window.myApiIds.push(ele.apiId)
    })
  }
  const buyedPluginsRes = await buyedPlugins()
  if (buyedPluginsRes.code === 0) {
    buyedPluginsRes.data.forEach(ele => {
      if (!window.buyedPlugin.includes(ele.type)) {
        window.buyedPlugin.push(ele.type)
      }
    })
  }
}

Vue.directive('checkInstalledApi', { // 判断是否有安装某些模块
  bind: async function(el, binding) {
    el.style.display = 'none'
    if (!window.loginedUserInfo) {
      await initData()
    }
    binding.value.forEach(v => {
      if (window.myApiIds.includes(v)) {
        el.style.display = ''
        return
      }
    })
  }
})

Vue.directive('checkBuyedPlugin', { // 判断有没有插件
  bind: async function(el, binding) {
    el.style.display = 'none'
    if (window.buyedPlugin.length === 0) {
      await initData()
    }
    if (window.loginedUserInfo.vipLevel === 2) {
      el.style.display = ''
      return
    }
    binding.value.forEach(v => {
      if (window.buyedPlugin.includes(v)) {
        el.style.display = ''
        return
      }
    })
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
