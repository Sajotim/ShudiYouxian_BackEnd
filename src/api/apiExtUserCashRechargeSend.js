import request from '@/utils/request'

export function fetchDataList(data) {
  return request({
    url: '/user/apiExtUserCashRechargeSend/list',
    method: 'post',
    data: {
      ...data
    }
  })
}

export function infoData(id) {
  return request({
    url: '/user/apiExtUserCashRechargeSend/info',
    method: 'get',
    params: {
      id
    }
  })
}

export function delData(id) {
  return request({
    url: '/user/apiExtUserCashRechargeSend/del',
    method: 'post',
    data: {
      id
    }
  })
}

export function saveData(data) {
  return request({
    url: '/user/apiExtUserCashRechargeSend/save',
    method: 'post',
    data: {
      ...data
    }
  })
}
