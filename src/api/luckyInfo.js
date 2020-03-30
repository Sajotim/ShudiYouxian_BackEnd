import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/luckyInfo/list',
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
    url: '/user/luckyInfo/info',
    method: 'get',
    params: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/luckyInfo/save',
    method: 'post',
    data: { ...data }
  })
}

export function delData(id) {
  return request({
    url: '/user/luckyInfo/del',
    method: 'post',
    data: { id }
  })
}

export function stopData(id) {
  return request({
    url: '/user/luckyInfo/stop',
    method: 'post',
    data: { id }
  })
}

export function award(id, awardCode) {
  return request({
    url: '/user/luckyInfo/award',
    method: 'post',
    data: { id, awardCode }
  })
}
