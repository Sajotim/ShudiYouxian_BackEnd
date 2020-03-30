import request from '@/utils/request'

export function fetchDataList(data) {
  return request({
    url: '/user/apiExtUserCashPayBillDiscounts/list',
    method: 'post',
    data: { ...data }
  })
}

export function infoData(id) {
  return request({
    url: '/user/apiExtUserCashPayBillDiscounts/info',
    method: 'get',
    params: { id }
  })
}

export function delData(id) {
  return request({
    url: '/user/apiExtUserCashPayBillDiscounts/del',
    method: 'post',
    data: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/apiExtUserCashPayBillDiscounts/save',
    method: 'post',
    data: { ...data }
  })
}
