import request from '@/utils/request'

export function fetchDataList() {
  return request({
    url: '/user/apiExtVerificationPicConfig/list',
    method: 'get'
  })
}

export function saveData(data) {
  return request({
    url: '/user/apiExtVerificationPicConfig/save',
    method: 'post',
    data: { ...data }
  })
}
