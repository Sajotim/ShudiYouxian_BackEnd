import request from '@/utils/request'

export function fetchDataList() {
  return request({
    url: '/user/apiExtShopGoodsCategory/list',
    method: 'post',
    data: {}
  })
}

export function infoData(id) {
  return request({
    url: '/user/apiExtShopGoodsCategory/info',
    method: 'get',
    params: { id }
  })
}

export function delData(id) {
  return request({
    url: '/user/apiExtShopGoodsCategory/del',
    method: 'post',
    data: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/apiExtShopGoodsCategory/save',
    method: 'post',
    data: { ...data }
  })
}
