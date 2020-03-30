import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/extUserWithdraw/list',
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
    url: '/user/extUserWithdraw/info',
    method: 'get',
    params: { id }
  })
}

export function successData(id) {
  return request({
    url: '/user/extUserWithdraw/success',
    method: 'post',
    data: { id }
  })
}

export function refuseData(id) {
  return request({
    url: '/user/extUserWithdraw/refuse',
    method: 'post',
    data: { id }
  })
}

export function payWx(id) {
  return request({
    url: '/user/extUserWithdraw/pay/wx',
    method: 'post',
    data: { id }
  })
}
