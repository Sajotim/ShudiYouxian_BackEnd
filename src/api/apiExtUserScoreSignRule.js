import request from '@/utils/request'

export function fetchDataList(data) {
  return request({
    url: '/user/apiExtUserScoreSignRule/list',
    method: 'post',
    data: { ...data }
  })
}

export function infoData(id) {
  return request({
    url: '/user/apiExtUserScoreSignRule/info',
    method: 'get',
    params: { id }
  })
}

export function delData(id) {
  return request({
    url: '/user/apiExtUserScoreSignRule/del',
    method: 'post',
    data: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/apiExtUserScoreSignRule/save',
    method: 'post',
    data: { ...data }
  })
}
