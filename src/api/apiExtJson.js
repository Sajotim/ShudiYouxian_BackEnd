import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/apiExtJson/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function saveData(data) {
  return request({
    url: '/user/apiExtJson/save',
    method: 'post',
    data: { ...data }
  })
}


export function delData(id) {
  return request({
    url: '/user/apiExtJson/del',
    method: 'post',
    data: { id }
  })
}

export function infoData(id) {
  return request({
    url: `/user/apiExtJson/info?id=${id}`,
    method: 'get'
  })
}

