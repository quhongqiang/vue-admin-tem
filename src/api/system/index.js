import request from '@/utils/requestRight'
// 角色管理
export function roleList(data) {
  return request({
    url: `role/list`,
    method: 'get',
    params: data
  })
}
// 添加角色
export function AddRole(data) {
  return request({
    url: `role/save`,
    method: 'post',
    data
  })
}
// 角色详情
export function roleDetail(data) {
  return request({
    url: `role/detail`,
    method: 'get',
    params: data
  })
}
// 删除角色
export function roleDel(data) {
  return request({
    url: `role/del`,
    method: 'post',
    data
  })
}
// 分配权限
export function saveRolePage(data) {
  return request({
    url: `/role/saveRolePage`,
    method: 'post',
    data
  })
}
// 权限回显
export function getRolePageList(data) {
  return request({
    url: `/role/getRolePageList`,
    method: 'post',
    data
  })
}

const permission = {
  name: 'RolePage',
  label: '角色管理',
  children: [
    {
      name: 'view',
      label: '查看'
    },
    {
      name: 'alldel',
      label: '批量删除'
    },
    {
      name: 'add',
      label: '添加'
    },
    {
      name: 'edit',
      label: '编辑'
    },
    {
      name: 'power',
      label: '分配权限'
    },
    {
      name: 'delete',
      label: '删除'
    }
  ]
}
export default { permission }
