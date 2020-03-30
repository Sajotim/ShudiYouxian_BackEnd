import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/apiExtShopGoods/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function getShopGoodsCategoryData() {
  return request({
    url: '/user/apiExtShopGoodsCategory/list',
    method: 'post',
    data: {}
  })
}

export function getGoodsCategoryData() {
  return request({
    url: '/user/apiExtShopGoodsCategory/list',
    method: 'post',
    data: {}
  })
}

export function getFreightTemplate() {
  return request({
    url: '/user/apiExtShopFreightTemplate/list',
    method: 'post',
    data: {}
  })
}

export function getProperty() {
  return request({
    url: 'user/apiExtShopProperty/list',
    method: 'post',
    data: {}
  })
}

export function getPropertyChild(propertyId) {
  return request({
    url: '/user/apiExtShopProperty/childs',
    method: 'post',
    data: { propertyId }
  })
}

export function delData(id) {
  return request({
    url: '/user/apiExtShopGoods/del',
    method: 'post',
    data: { id }
  })
}

export function needvVetGoodsNumber() {
  return request({
    url: '/user/apiExtShopGoods/vet/count',
    method: 'get'
  })
}

export function vetGoods(id, vetStatus) {
  return request({
    url: '/user/apiExtShopGoods/vet',
    method: 'post',
    data: { id, vetStatus }
  })
}

export function modifyNumberOrders(data) {
  return request({
    url: '/user/apiExtShopGoods/modify/numberOrders',
    method: 'post',
    data: data
  })
}

export function modifyNumberSells(data) {
  return request({
    url: '/user/apiExtShopGoods/modify/numberSells',
    method: 'post',
    data: data
  })
}

export function info(id) {
  return request({
    url: '/user/apiExtShopGoods/info',
    method: 'get',
    params: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/apiExtShopGoods/save',
    method: 'post',
    data: { ...data }
  })
}

export function rebate(id) {
  return request({
    url: '/user/apiExtShopGoods/rebate',
    method: 'get',
    params: { id }
  })
}

export function saveRebate(data) {
  return request({
    url: '/user/apiExtShopGoods/rebate/save',
    method: 'post',
    data: { ...data }
  })
}

export function modifystatus(ids, status) {
  return request({
    url: '/user/apiExtShopGoods/modify/status',
    method: 'post',
    data: { ids, status }
  })
}

export function modifyRecommendStatus(ids, recommendStatus) {
  return request({
    url: '/user/apiExtShopGoods/modify/recommendStatus',
    method: 'post',
    data: { ids, recommendStatus }
  })
}

export function getdayPrices(goodsId, priceId) {
  return request({
    url: '/user/goods/price/day/list',
    method: 'get',
    params: { goodsId, priceId }
  })
}

export function modifyDayPrice(data) {
  return request({
    url: '/user/goods/price/day/save',
    method: 'post',
    data
  })
}

export function fetchGoodsLimitationList(goodsId, priceId) {
  return request({
    url: '/user/goods/limitation/list',
    method: 'get',
    params: {
      goodsId,
      priceId
    }
  })
}

export function saveGoodsLimitation(data) {
  return request({
    url: '/user/goods/limitation/save',
    method: 'post',
    data: { ...data }
  })
}

export function delGoodsLimitationData(ids) {
  return request({
    url: '/user/goods/limitation/del',
    method: 'post',
    data: { ids }
  })
}

export function fetchGoodsBenefitList(goodsId, priceId) {
  return request({
    url: '/user/goods/benefit/list',
    method: 'get',
    params: {
      goodsId,
      priceId
    }
  })
}

export function saveGoodsBenefit(data) {
  return request({
    url: '/user/goods/benefit/save',
    method: 'post',
    data: { ...data }
  })
}

export function delGoodsBenefit(ids) {
  return request({
    url: '/user/goods/benefit/del',
    method: 'post',
    data: { ids }
  })
}

export function fetchGoodsCouponList(goodsId, priceId) {
  return request({
    url: '/user/goods/coupon/list',
    method: 'get',
    params: {
      goodsId,
      priceId
    }
  })
}

export function saveGoodsCoupon(data) {
  return request({
    url: '/user/goods/coupon/save',
    method: 'post',
    data: { ...data }
  })
}

export function delGoodsCoupon(ids) {
  return request({
    url: '/user/goods/coupon/del',
    method: 'post',
    data: { ids }
  })
}
