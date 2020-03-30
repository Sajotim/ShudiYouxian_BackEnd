import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/apiExtUserShippingAddress/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function delData(id) {
  return request({
    url: '/user/apiExtUserShippingAddress/del',
    method: 'post',
    data: { id }
  })
}

export function info(id) {
  return request({
    url: '/user/apiExtUserShippingAddress/info',
    method: 'get',
    params: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/apiExtUserShippingAddress/save',
    method: 'post',
    data: { ...data }
  })
}
