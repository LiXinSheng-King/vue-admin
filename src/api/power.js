import request from '@/utils/request.js'

// 权限列表数据
export const onGetRightsList = (params) => {
  return request({
    method: 'GET',
    url: `rights/${params.type}`,
    params
  })
}

// 角色列表
export const onGetRolesList = (params) => {
  return request({
    method: 'GET',
    url: 'roles',
    params
  })
}

// 添加角色
export const onAddRoles = (data) => {
  return request({
    method: 'POST',
    url: 'roles',
    data
  })
}

// 根据id查询角色
export const onShowEditDialog = (ID) => {
  return request({
    method: 'GET',
    url: `roles/${ID}`
  })
}

// 编辑角色并提交
export const onEditRoles = (data) => {
  return request({
    method: 'PUT',
    url: `roles/${data.roleId}`,
    data
  })
}

// 删除角色
export const onRemoveRoleById = (ID) => {
  return request({
    method: 'DELETE',
    url: `roles/${ID}`
  })
}

// 删除角色指定权限
export const onRemoveRightById = (params) => {
  return request({
    method: 'DELETE',
    url: `roles/${params.roleId}/rights/${params.rightId}`
  })
}

// 树状展示权限
export const onShowSetRightDialog = (params) => {
  return request({
    method: 'GET',
    url: `rights/${params.type}`,
    params
  })
}

// 添加权限分配并提交
export const onAllotRights = (data) => {
  return request({
    method: 'POST',
    url: `roles/${data.roleId}/rights`,
    data
  })
}
