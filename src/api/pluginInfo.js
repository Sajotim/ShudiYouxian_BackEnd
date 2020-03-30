import request from '@/utils/request'

export function buyedPlugins() {
  return request({
    url: '/user/pluginInfo/list',
    method: 'get'
  })
}

export function getPayData(data) {
  return request({
    url: '/buy/plugin/getPayData',
    method: 'post',
    data: data
  })
}
