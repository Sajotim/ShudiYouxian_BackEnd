import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/apiExtConfig/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function getConfigInfo(id) {
  return request({
    url: '/user/apiExtConfig/info',
    method: 'get',
    params: { id }
  })
}

export function batchConfigInfos(keys) {
  return request({
    url: '/user/apiExtConfig/values',
    method: 'get',
    params: { key: keys }
  })
}

export function delData(id) {
  return request({
    url: '/user/apiExtConfig/del',
    method: 'post',
    data: { id }
  })
}

export function saveConfig(data) {
  return request({
    url: '/user/apiExtConfig/save',
    method: 'post',
    data: { ...data }
  })
}

export function modifyConfig(key, content) {
  return request({
    url: '/user/apiExtConfig/modify',
    method: 'post',
    data: { key, content }
  })
}
