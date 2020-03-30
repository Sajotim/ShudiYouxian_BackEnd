import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/logSms/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function truncateLogSms() {
  return request({
    url: '/user/logSms/truncate',
    method: 'post'
  })
}
