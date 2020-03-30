import request from '@/utils/request'

export function fetchDataList(data) {
  return request({
    url: '/user/alipayTransferQrcode/list',
    method: 'post',
    data: { ...data }
  })
}

export function infoData(id) {
  return request({
    url: '/user/alipayTransferQrcode/info',
    method: 'get',
    params: { id }
  })
}

export function delData(id) {
  return request({
    url: '/user/alipayTransferQrcode/del',
    method: 'post',
    data: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/alipayTransferQrcode/save',
    method: 'post',
    data: { ...data }
  })
}
