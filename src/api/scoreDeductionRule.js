import request from '@/utils/request'

export function fetchDataList(data) {
  return request({
    url: '/user/scoreDeductionRule/list',
    method: 'post',
    data: {
      ...data
    }
  })
}

export function infoData(id) {
  return request({
    url: '/user/scoreDeductionRule/info',
    method: 'get',
    params: {
      id
    }
  })
}

export function delData(id) {
  return request({
    url: '/user/scoreDeductionRule/del',
    method: 'post',
    data: {
      id
    }
  })
}

export function saveData(data) {
  return request({
    url: '/user/scoreDeductionRule/save',
    method: 'post',
    data: {
      ...data
    }
  })
}
