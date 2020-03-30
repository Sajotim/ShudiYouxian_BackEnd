import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/kanjiaJoiner/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function saveStatus(id, status) {
  return request({
    url: '/user/kanjiaJoiner/status',
    method: 'post',
    data: { id, status }
  })
}

export function delData(id) {
  return request({
    url: '/user/kanjiaJoiner/del',
    method: 'post',
    data: { id }
  })
}
