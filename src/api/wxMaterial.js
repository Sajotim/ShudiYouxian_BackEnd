import request from '@/utils/request'

export function fetchMaterialImageList(page, pageSize) {
  return request({
    url: '/user/wx/material/images/list',
    method: 'post',
    data: {
      page,
      pageSize
    }
  })
}

export function delMaterialImage(mediaId) {
  return request({
    url: '/user/wx/material/images/del',
    method: 'post',
    data: { mediaId }
  })
}

export function uploadMaterialImage(url) {
  return request({
    url: '/user/wx/material/images/upload',
    method: 'post',
    data: { url }
  })
}
