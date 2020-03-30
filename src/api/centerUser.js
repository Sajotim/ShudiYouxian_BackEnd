import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/centerUser/list',
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
    url: '/user/centerUser/info',
    method: 'get',
    params: { id }
  })
}

export function wxInfo() {
  return request({
    url: '/user/wxInfo',
    method: 'get'
  })
}

export function delData(id) {
  return request({
    url: '/user/centerUser/del',
    method: 'post',
    data: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/centerUser/save',
    method: 'post',
    data: { ...data }
  })
}

export function getVIPPayData(userId, vipLevel) {
  return request({
    url: '/vip/getPayData',
    method: 'post',
    data: { userId, vipLevel }
  })
}

export function statisticsData() {
  return request({
    url: '/user/statistics',
    method: 'get'
  })
}

export function editMobile(mobile, oldPwd, smsCode) {
  return request({
    url: '/user/editMobile/save',
    method: 'post',
    data: { mobile, oldPwd, smsCode }
  })
}

export function changeDomain(domain) {
  return request({
    url: '/user/changeDomain',
    method: 'post',
    data: { domain }
  })
}

export function changeName(realName) {
  return request({
    url: '/user/changeName',
    method: 'post',
    data: { realName }
  })
}

export function resetKey() {
  return request({
    url: '/user/resetKey',
    method: 'post'
  })
}

export function unBindWX() {
  return request({
    url: '/user/unBindWX',
    method: 'post'
  })
}

export function logedAdminList() {
  return request({
    url: '/user/logedAdminList',
    method: 'get'
  })
}

export function kickOut(token) {
  return request({
    url: '/user/kickOut',
    method: 'post',
    data: { token }
  })
}
