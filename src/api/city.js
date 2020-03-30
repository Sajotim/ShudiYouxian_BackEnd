import request from '@/utils/request'

export function fetchProvinceList() {
  return request({
    url: 'https://api.it120.cc/common/region/v2/province',
    noToken: true,
    method: 'get'
  })
}

export function fetchChildList(pid) {
  return request({
    url: 'https://api.it120.cc/common/region/v2/child',
    noToken: true,
    method: 'get',
    params: {
      pid
    }
  })
}
