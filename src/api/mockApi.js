import request from '@/utils/request'

export function mockApiList() {
  return request({
    url: '/user/mockApi/list',
    method: 'get'
  })
}

export function mockApiInfo(id) {
  return request({
    url: '/user/mockApi/info',
    method: 'get',
    params: { id }
  })
}

export function delMockGroup(groupId) {
  return request({
    url: '/user/mockApi/del-group',
    method: 'post',
    data: { id: groupId }
  })
}

export function delMockApi(id) {
  return request({
    url: '/user/mockApi/del',
    method: 'post',
    data: { id }
  })
}

export function saveMockGroup(data) {
  return request({
    url: '/user/mockApi/save-group',
    method: 'post',
    data: { ...data }
  })
}

export function saveMockApi(data) {
  return request({
    url: '/user/mockApi/save',
    method: 'post',
    data: { ...data }
  })
}
