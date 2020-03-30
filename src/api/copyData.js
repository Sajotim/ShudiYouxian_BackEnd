import request from '@/utils/request'

export function typeA(data) {
  return request({
    url: '/user/copyData/typeA',
    method: 'post',
    data: { ...data }
  })
}

export function typeB(merchantId) {
  return request({
    url: '/user/copyData/typeB',
    method: 'post',
    data: { merchantId }
  })
}
