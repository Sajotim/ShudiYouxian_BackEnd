import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/apiExtComment/list',
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
    url: '/user/apiExtComment/info',
    method: 'get',
    params: { id }
  })
}

export function delData(id) {
  return request({
    url: '/user/apiExtComment/del',
    method: 'post',
    data: { id }
  })
}

export function replyData(data) {
  return request({
    url: '/user/apiExtComment/reply',
    method: 'post',
    data: data
  })
}

export function vetData(id) {
  return request({
    url: '/user/apiExtComment/vet',
    method: 'post',
    data: { id }
  })
}
