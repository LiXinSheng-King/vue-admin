import request from '@/utils/request.js'

// 商品分类数据
export const onGetCateList = (params) => {
  return request({
    method: 'GET',
    url: '/categories',
    params
  })
}

// 参数列表数据
export const onGetParamsData = (params) => {
  return request({
    method: 'GET',
    url: `categories/${params.id}/attributes`,
    params
  })
}

// 添加参数
export const onAddParams = (data) => {
  return request({
    method: 'POST',
    url: `categories/${data.id}/attributes`,
    data
  })
}

// 根据id查询参数
export const onShowEditDialog = (params) => {
  return request({
    method: 'GET',
    url: `categories/${params.id}/attributes/${params.attrId}`,
    params
  })
}

// 修改参数并提交
export const onEditParams = (data) => {
  return request({
    method: 'PUT',
    url: `categories/${data.id}/attributes/${data.attrId}`,
    data
  })
}

// 删除参数
export const onRemoveParams = (data) => {
  return request({
    method: 'DELETE',
    url: `categories/${data.id}/attributes/${data.attrId}`,
    data
  })
}

// New Tag标签参数提交
export const onSaveAttrVals = (data) => {
  return request({
    method: 'PUT',
    url: `categories/${data.id}/attributes/${data.attrId}`,
    data
  })
}
