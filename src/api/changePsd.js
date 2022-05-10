import request from '@/utils/requestRight'
// 修改密码
export function PasswordSave(data) {
  return request({
    url: `/user/PasswordSave`,
    method: 'post',
    data
  })
}
