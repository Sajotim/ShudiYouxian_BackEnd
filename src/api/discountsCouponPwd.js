import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/discountsCouponPwd/list',
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
    url: '/user/discountsCouponPwd/info',
    method: 'get',
    params: { id }
  })
}

export function invalidData(id) {
  return request({
    url: '/user/discountsCouponPwd/invalid',
    method: 'post',
    data: { id }
  })
}

export function delData(id) {
  return request({
    url: '/user/discountsCouponPwd/del',
    method: 'post',
    data: { id }
  })
}

export function createData(data) {
  return request({
    url: '/user/discountsCouponPwd/create',
    method: 'post',
    data: { ...data }
  })
}
