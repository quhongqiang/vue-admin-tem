import request from '@/utils/requestRight'

export function login(data) {
  return request({
    url: 'https://json.tewx.cn/json/API_kdd531mytfdzm06i?sdAS1dsnuUa3sd=406&Jsdh4bajs99dii=eg1ipwcuknarqtmy',
    method: 'get',
    params: data
  })
}

const permission = {

}
export default { permission }
