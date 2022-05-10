import request from '@/utils/requestRight'

export function login(data) {
  return request({
    url: '/web/login.html',
    method: 'get',
    params: data
  })
}
// 验证码
export function getCode(data) {
  return request({
    url: '/web/kaptcha',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

const permission = {

}
export default { permission }
