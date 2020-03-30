import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/apiExtUserScoreLog/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function modifyUserScore(data) {
  return request({
    url: '/user/apiExtUserScoreLog/save',
    method: 'post',
    data: { ...data }
  })
}
