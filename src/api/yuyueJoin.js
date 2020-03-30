import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/yuyueJoin/list',
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
    url: '/user/yuyueJoin/del',
    method: 'post',
    data: { id }
  })
}

export function successData(id) {
  return request({
    url: '/user/yuyueJoin/success',
    method: 'post',
    data: { id }
  })
}

export function serveredData(id) {
  return request({
    url: '/user/yuyueJoin/servered',
    method: 'post',
    data: { id }
  })
}

export function infoData(id) {
  return request({
    url: '/user/yuyueJoin/info',
    method: 'get',
    params: { id }
  })
}

export function cancelData(id, refund) {
  return request({
    url: '/user/yuyueJoin/cancel',
    method: 'post',
    data: { id, refund }
  })
}
