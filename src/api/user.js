import request from '@/utils/request.js'

// 登录验证
export const onLogin = (data) => {
  return request({
    method: 'POST',
    url: '/login',
    data: data
    // data: data data用来设置 POST 的请求体
  })
}

// 侧边栏
export const onGetMenuList = (data) => {
  return request({
    method: 'GET',
    url: '/menus',
    data: data
  })
}

// 获取用户列表数据
export const onGetUserList = (params) => {
  return request({
    method: 'GET',
    url: '/users',
    params: params
  })
}

// 获取用户状态
export const onUserStateChanged = (params) => {
  return request({
    method: 'PUT',
    url: `/users/${params.uId}/state/${params.type}`,
    params: params
  })
}

// 添加用户
export const onAddUser = (data) => {
  return request({
    method: 'POST',
    url: '/users',
    data
  })
}

// 查询用户
export const onShowEditDialog = (ID) => {
  return request({
    method: 'GET',
    url: `users/${ID}`
  })
}

// 编辑用户并提交
export const onEditUserInfo = (data) => {
  return request({
    method: 'PUT',
    url: `users/${data.id}`,
    data
  })
}

// 删除用户
export const onRemoveUserById = (ID) => {
  return request({
    method: 'DELETE',
    url: `users/${ID}`
  })
}

// 分配角色数据对话框
export const onShowSetRole = (params) => {
  return request({
    method: 'GET',
    url: 'roles',
    params
  })
}

// 选择分配角色并提交
export const onSaveRoleInfo = (data) => {
  return request({
    method: 'PUT',
    url: `users/${data.id}/role`,
    data
  })
}
