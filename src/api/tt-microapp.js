import request from '@/utils/request'

export function infoData() {
  return request({
    url: '/user/tt/microapp/info',
    method: 'get'
  })
}

export function delData() {
  return request({
    url: '/user/tt/microapp/del',
    method: 'post'
  })
}

export function saveData(data) {
  return request({
    url: '/user/tt/microapp/save',
    method: 'post',
    data: { ...data }
  })
}

export function qrcode(data) {
  return request({
    url: '/user/tt/microapp/qrcode',
    method: 'post',
    data: { ...data }
  })
}
