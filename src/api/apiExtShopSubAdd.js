import request from '@/utils/request'

export function info(id) {
  return request({
    url: '/user/apiExtShopSub/info',
    method: 'get',
    params: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/apiExtShopSub/save',
    method: 'post',
    data: { ...data }
  })
}
