import request from '@/utils/request'

export function fetchShopPageList(page, pageSize, data) {
  return request({
    url: '/user/apiExtShopSub/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function delData(id) {
  return request({
    url: '/user/apiExtShopSub/del',
    method: 'post',
    data: { id }
  })
}
