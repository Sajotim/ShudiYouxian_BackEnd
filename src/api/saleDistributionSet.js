import request from '@/utils/request'

export function info() {
  return request({
    url: '/user/saleDistributionSet/info',
    method: 'get'
  })
}

export function delData() {
  return request({
    url: '/user/saleDistributionSet/del',
    method: 'post'
  })
}

export function saveData(data) {
  return request({
    url: '/user/saleDistributionSet/save',
    method: 'post',
    data: { ...data }
  })
}
