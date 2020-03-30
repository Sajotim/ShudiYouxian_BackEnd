import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/alipayTransfer/list',
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
    url: '/user/alipayTransfer/invalid',
    method: 'post',
    data: { id }
  })
}
