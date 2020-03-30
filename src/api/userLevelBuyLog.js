import request from '@/utils/request'

export function fetchUserLevelBuyLog(page, pageSize, data) {
  return request({
    url: '/user/userLevelBuyLog/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}
