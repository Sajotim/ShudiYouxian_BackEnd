import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/voteInfo/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function voteJoinList(page, pageSize, data) {
  return request({
    url: '/user/voteJoin/list',
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
    url: '/user/voteInfo/info',
    method: 'get',
    params: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/voteInfo/save',
    method: 'post',
    data: data
  })
}

export function importFromYuyue(yuyueId) {
  return request({
    url: '/user/voteInfo/importFromYuyue',
    method: 'post',
    data: {
      yuyueId
    }
  })
}

export function delData(id) {
  return request({
    url: '/user/voteInfo/del',
    method: 'post',
    data: { id }
  })
}

export function saveItemsData(data) {
  return request({
    url: '/user/voteInfo/items/save',
    method: 'post',
    data: data
  })
}

export function delItemsData(id) {
  return request({
    url: '/user/voteInfo/items/del',
    method: 'post',
    data: { id }
  })
}
