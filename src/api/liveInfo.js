import request from '@/utils/request'

export function liveRooms() {
  return request({
    url: '/user/wxa-live/rooms',
    method: 'get'
  })
}

export function liveHisVedios(roomId) {
  return request({
    url: '/user/wxa-live/his',
    method: 'get',
    params: { roomId }
  })
}
