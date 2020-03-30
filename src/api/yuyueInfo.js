import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/yuyueInfo/list',
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
    url: '/user/yuyueInfo/info',
    method: 'get',
    params: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/yuyueInfo/save',
    method: 'post',
    data: data
  })
}

export function delData(id) {
  return request({
    url: '/user/yuyueInfo/del',
    method: 'post',
    data: { id }
  })
}
