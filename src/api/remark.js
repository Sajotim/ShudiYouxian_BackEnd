import request from '@/utils/request'

export function fetchRemarkList(type, refId) {
  return request({
    url: '/user/remark/list',
    method: 'get',
    params: {
      type,
      refId
    }
  })
}

export function saveRemark(type, refId, remark) {
  return request({
    url: '/user/remark/save',
    method: 'post',
    data: {
      type,
      refId,
      remark
    }
  })
}
