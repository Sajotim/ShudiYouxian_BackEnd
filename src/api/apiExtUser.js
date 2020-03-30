import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/apiExtUser/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function info(id) {
  return request({
    url: '/user/apiExtUser/info',
    method: 'get',
    params: { id }
  })
}

export function addNewUser(data) {
  return request({
    url: '/user/apiExtUser/addNewUser',
    method: 'post',
    data: { ...data }
  })
}

export function modifyUser(data) {
  return request({
    url: '/user/apiExtUser/modify',
    method: 'post',
    data: { ...data }
  })
}

export function importFromWX() {
  return request({
    url: '/user/apiExtUser/importFromWX',
    method: 'post'
  })
}

export function delData(id) {
  return request({
    url: '/user/apiExtUser/del',
    method: 'post',
    data: { id }
  })
}

export function delUserFriend(uidm, uids) {
  return request({
    url: '/user/apiExtUserFriend/del',
    method: 'post',
    data: { uidm, uids }
  })
}
