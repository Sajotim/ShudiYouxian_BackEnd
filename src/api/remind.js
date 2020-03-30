import request from '@/utils/request'

export function remindCurIndex() {
  return request({
    url: '/user/remind/curIndex',
    method: 'get'
  })
}

export function remindReadNext(curIndex) {
  return request({
    url: '/user/remind/readNext',
    method: 'get',
    params: { curIndex }
  })
}
