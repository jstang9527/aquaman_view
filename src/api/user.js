import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin',
    method: 'post'
  })
}

export function changePwd(data) {
  return request({
    url: '/admin/change_pwd',
    method: 'post',
    data
  })
}