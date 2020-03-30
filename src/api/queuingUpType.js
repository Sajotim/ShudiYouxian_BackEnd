import request from '@/utils/request'

export function fetchQueuingUpTypeList(page, pageSize, data) {
  return request({
    url: '/user/queuingUpType/list',
    method: 'post',
    data: { 
      page,
      pageSize,
      ...data 
    }
  })
}

export function info(id) {
  return request({
    url: '/user/queuingUpType/info',
    method: 'get',
    params: { id }
  })
}

export function curService(id, serviceWindow) {
  return request({
    url: '/user/queuingUpType/curService',
    method: 'post',
    data: { id, serviceWindow }
  })
}

export function jumpCurService(id, serviceWindow) {
  return request({
    url: '/user/queuingUpType/jump',
    method: 'post',
    data: { id, serviceWindow }
  })
}

export function successCurService(id, serviceWindow, logId) {
  return request({
    url: '/user/queuingUpType/success',
    method: 'post',
    data: { id, serviceWindow, logId }
  })
}

export function saveData(data) {
  return request({
    url: '/user/queuingUpType/save',
    method: 'post',
    data: { ...data }
  })
}

export function delData(id) {
  return request({
    url: '/user/queuingUpType/del',
    method: 'post',
    data: { id }
  })
}

export function resetData(id) {
  return request({
    url: '/user/queuingUpType/reset',
    method: 'post',
    data: { id }
  })
}