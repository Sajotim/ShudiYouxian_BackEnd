import request from '@/utils/request'

export function fetchDataList() {
  return request({
    url: '/user/centerUserSetUpyun/list',
    method: 'get'
  })
}

export function infoData(id) {
  return request({
    url: '/user/centerUserSetUpyun/info',
    method: 'get',
    params: { id }
  })
}

export function delData(id) {
  return request({
    url: '/user/centerUserSetUpyun/del',
    method: 'post',
    data: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/centerUserSetUpyun/save',
    method: 'post',
    data: { ...data }
  })
}
