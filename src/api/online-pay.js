import request from '@/utils/request'

export function info() {
  return request({
    url: '/user/online-pay/info',
    method: 'get'
  })
}

export function delData(type) {
  return request({
    url: '/user/online-pay/del',
    method: 'post',
    data: {
      type
    }
  })
}

export function saveData(data) {
  return request({
    url: '/user/online-pay/save',
    method: 'post',
    data: { ...data }
  })
}
