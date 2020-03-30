import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/invoiceApply/list',
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
    url: '/user/invoiceApply/info',
    method: 'get',
    params: { id }
  })
}

export function modifyData(data) {
  return request({
    url: '/user/invoiceApply/modify',
    method: 'post',
    data: data
  })
}

export function delData(id) {
  return request({
    url: '/user/invoiceApply/del',
    method: 'post',
    data: { id }
  })
}
