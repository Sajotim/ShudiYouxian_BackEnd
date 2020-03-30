import request from '@/utils/request'

export function fetchDataList(data) {
  return request({
    url: '/user/admin/list',
    method: 'post',
    data: { ...data }
  })
}

export function infoData(id) {
  return request({
    url: '/user/admin/info',
    method: 'get',
    params: { id }
  })
}

export function stopData(id) {
  return request({
    url: '/user/admin/stop',
    method: 'post',
    data: { id }
  })
}

export function unstopData(id) {
  return request({
    url: '/user/admin/unstop',
    method: 'post',
    data: { id }
  })
}

export function delData(id) {
  return request({
    url: '/user/admin/del',
    method: 'post',
    data: { id }
  })
}

export function resetPwd(id, pwd) {
  return request({
    url: '/user/admin/resetPwd',
    method: 'post',
    data: { id, pwd }
  })
}

export function saveData(data) {
  return request({
    url: '/user/admin/save',
    method: 'post',
    data: { ...data }
  })
}
