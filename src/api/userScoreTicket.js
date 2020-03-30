import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/userScoreTicket/list',
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
    url: '/user/userScoreTicket/invalid',
    method: 'post',
    data: { id }
  })
}

export function delData(id) {
  return request({
    url: '/user/userScoreTicket/del',
    method: 'post',
    data: { id }
  })
}

export function createData(data) {
  return request({
    url: '/user/userScoreTicket/create',
    method: 'post',
    data: { ...data }
  })
}
