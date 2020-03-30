import request from '@/utils/request'

export function info() {
  return request({
    url: '/user/centerUserSetKefu/info',
    method: 'get'
  })
}

export function delData() {
  return request({
    url: '/user/centerUserSetKefu/del',
    method: 'post'
  })
}

export function saveData(data) {
  return request({
    url: '/user/centerUserSetKefu/save',
    method: 'post',
    data: { ...data }
  })
}
