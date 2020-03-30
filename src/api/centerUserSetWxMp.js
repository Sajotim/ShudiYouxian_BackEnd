import request from '@/utils/request'

export function infoData() {
  return request({
    url: '/user/wx/mp/list',
    method: 'get'
  })
}

export function delData() {
  return request({
    url: '/user/wx/mp/del',
    method: 'post'
  })
}

export function saveData(data) {
  return request({
    url: '/user/wx/mp/save',
    method: 'post',
    data: { ...data }
  })
}
