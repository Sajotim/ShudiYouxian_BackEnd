import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/extDiscountsCouponUser/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function invalidData(id) {
  return request({
    url: '/user/extDiscountsCouponUser/invalid',
    method: 'post',
    data: { id }
  })
}

export function deleteData(id) {
  return request({
    url: '/user/extDiscountsCouponUser/del',
    method: 'post',
    data: { id }
  })
}
