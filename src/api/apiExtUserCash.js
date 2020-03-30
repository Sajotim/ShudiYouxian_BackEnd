import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/apiExtUserCash/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function modifyUserGrowth(data) {
  return request({
    url: '/user/apiExtUserCash/modifyGrowth',
    method: 'post',
    data: { ...data }
  })
}
