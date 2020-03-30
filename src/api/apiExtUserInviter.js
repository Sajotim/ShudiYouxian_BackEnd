import request from '@/utils/request'

export function fetchList(page, pageSize, data) {
  return request({
    url: '/user/apiExtUserInviter/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function saveData(data) {
  return request({
    url: '/user/apiExtUserInviter/save',
    method: 'post',
    data: { ...data }
  })
}

export function delData(id) {
  return request({
    url: '/user/apiExtUserInviter/del',
    method: 'post',
    data:{id}
  })
}
