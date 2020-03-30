import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/extDiscountsCoupon/list',
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
    url: '/user/extDiscountsCoupon/info',
    method: 'get',
    params: { id }
  })
}

export function delData(id) {
  return request({
    url: '/user/extDiscountsCoupon/del',
    method: 'post',
    data: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/extDiscountsCoupon/save',
    method: 'post',
    data: { ...data }
  })
}

export function sendUser(id, uid) {
  return request({
    url: '/user/extDiscountsCoupon/sendUser',
    method: 'post',
    data: { id, uid }
  })
}

export function sendUserLevel(id, levelId) {
  return request({
    url: '/user/extDiscountsCoupon/sendUserLevel',
    method: 'post',
    data: { id, levelId }
  })
}