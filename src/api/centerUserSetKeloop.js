import request from '@/utils/request'

export function info() {
  return request({
    url: '/user/centerUserSetKeloop/info',
    method: 'get'
  })
}

export function delData() {
  return request({
    url: '/user/centerUserSetKeloop/del',
    method: 'post'
  })
}

export function saveData(data) {
  return request({
    url: '/user/centerUserSetKeloop/save',
    method: 'post',
    data: { ...data }
  })
}
