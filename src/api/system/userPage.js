import request from '@/utils/requestRight'
// 用户列表
export function userList(data) {
  return request({
    url: `user/list`,
    method: 'get',
    params: data
  })
}
// 添加用户
export function addUser(data) {
  return request({
    url: `user/save`,
    method: 'post',
    data
  })
}
// 用户详情
export function userDetail(data) {
  return request({
    url: `user/detail`,
    method: 'get',
    params: data
  })
}
// 分配角色
export function userRoleList(data) {
  return request({
    url: `user/userRoleList`,
    method: 'get',
    params: data
  })
}
// 保存角色
export function saveUserRole(data) {
  return request({
    url: `user/saveUserRole`,
    method: 'post',
    data
  })
}
// 删除用户
export function delUser(data) {
  return request({
    url: `user/del`,
    method: 'post',
    data
  })
}
const permission = {
  name: 'UserPage',
  label: '用户管理',
  children: [
    {
      name: 'view',
      label: '查看'
    },
    {
      name: 'add',
      label: '添加'
    },
    {
      name: 'allDel',
      label: '批量删除'
    },
    {
      name: 'edit',
      label: '编辑'
    },
    {
      name: 'delete',
      label: '删除'
    },
    {
      name: 'role',
      label: '分配角色'
    }
  ]
}
export default { permission }
