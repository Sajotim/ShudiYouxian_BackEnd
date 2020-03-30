import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/apiExtUserPay/list',
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
    url: '/user/apiExtUserPay/success',
    method: 'post',
    data: { id }
  })
}

export function modifyUserAmount(data) {
  return request({
    url: '/user/apiExtUserPay/save',
    method: 'post',
    data: { ...data }
  })
}
