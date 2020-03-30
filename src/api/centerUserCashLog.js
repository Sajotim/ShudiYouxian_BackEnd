import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/centerUserCashLog/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function recharge(money) {
  return request({
    url: '/user/centerUserCashLog/recharge',
    method: 'post',
    data: {
      money
    }
  })
}
