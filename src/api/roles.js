import request from '@/utils/request'

export function fetchAllRoles() {
  return request({
    url: '/user/roles/list',
    method: 'post'
  })
}

export function infoData(id) {
  return request({
    url: '/user/roles/info',
    method: 'get',
    params: { id }
  })
}

export function fetchAllActions() {
  return request({
    url: '/user/roles/actions',
    method: 'get'
  })
}

export function delData(id) {
  return request({
    url: '/user/roles/del',
    method: 'post',
    data: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/roles/save',
    method: 'post',
    data: { ...data }
  })
}
