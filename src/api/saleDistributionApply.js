import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/saleDistributionApply/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function passData(id) {
  return request({
    url: '/user/saleDistributionApply/pass',
    method: 'post',
    data: { id }
  })
}

export function refuseData(id, remark) {
  return request({
    url: '/user/saleDistributionApply/refuse',
    method: 'post',
    data: { id, remark }
  })
}

export function delData(id) {
  return request({
    url: '/user/saleDistributionApply/del',
    method: 'post',
    data: { id }
  })
}