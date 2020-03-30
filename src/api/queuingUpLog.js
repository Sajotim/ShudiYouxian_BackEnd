import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/queuingUpLog/list',
    method: 'post',
    data: { 
      page,
      pageSize,
      ...data 
    }
  })
}

export function successData(id) {
  return request({
    url: '/user/queuingUpLog/success',
    method: 'post',
    data: { id }
  })
}

export function skipData(id) {
  return request({
    url: '/user/queuingUpLog/skip',
    method: 'post',
    data: { id }
  })
}
