import request from '@/utils/request'

export function fetchDataList() {
  return request({
    url: '/user/set/dfsConfig/list',
    method: 'get'
  })
}

export function infoData(id) {
  return request({
    url: '/user/set/dfsConfig/info',
    method: 'get',
    params: { id }
  })
}

export function delData(id) {
  return request({
    url: '/user/set/dfsConfig/del',
    method: 'post',
    data: { id }
  })
}

export function enableDfsConfig(id) {
  return request({
    url: '/user/set/dfsConfig/enable',
    method: 'post',
    data: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/set/dfsConfig/save',
    method: 'post',
    data: { ...data }
  })
}
