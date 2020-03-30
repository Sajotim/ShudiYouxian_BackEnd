import request from '@/utils/request'

export function allApiList(page, pageSize, data) {
  return request({
    url: '/apis/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function myInstallApiList(page, pageSize, data) {
  return request({
    url: '/user/centerUserApi/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function installApi(id) {
  return request({
    url: '/user/centerUserApi/install',
    method: 'post',
    data: { id }
  })
}

export function uninstallApi(id) {
  return request({
    url: '/user/centerUserApi/uninstall',
    method: 'post',
    data: { id }
  })
}

export function apiBuyList(id) {
  return request({
    url: '/user/centerUserApi/buy',
    method: 'get',
    params: { id }
  })
}

export function getPayData(userId, apiPriceId) {
  return request({
    url: '/buy/centerUserApi/getPayData',
    method: 'post',
    data: {
      userId,
      apiPriceId
    }
  })
}
