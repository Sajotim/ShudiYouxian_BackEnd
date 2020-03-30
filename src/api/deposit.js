import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/deposit/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function infoData(id) {
  return request({
    url: '/user/deposit/info',
    method: 'get',
    params: { id }
  })
}

export function payData(data) {
  return request({
    url: '/user/deposit/pay',
    method: 'post',
    data: data
  })
}

export function backData(id) {
  return request({
    url: '/user/deposit/back',
    method: 'post',
    data: { id }
  })
}
