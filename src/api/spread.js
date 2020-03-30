import request from '@/utils/request'

export function teams(page, pageSize, data) {
  return request({
    url: '/user/spread/teams',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function bindAlipay(alipay) {
  return request({
    url: '/user/spread/alipay',
    method: 'post',
    data: {
      alipay
    }
  })
}

export function applyAmount(amount) {
  return request({
    url: '/user/spread/apply',
    method: 'post',
    data: { amount }
  })
}
