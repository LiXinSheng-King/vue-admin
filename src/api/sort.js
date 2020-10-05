import request from '@/utils/request.js'

// 商品分类数据
export const onGetCateList = (params) => {
  return request({
    method: 'GET',
    url: '/categories',
    params
  })
}

// 获取父级分类的数据
export const onGetParentCateList = (params) => {
  return request({
    method: 'GET',
    url: '/categories',
    params
  })
}

// 添加分类
export const onAddCate = (data) => {
  return request({
    method: 'POST',
    url: 'categories',
    data
  })
}

// 根据id查询商品
export const onShowEditCateDialog = (ID) => {
  return request({
    method: 'GET',
    url: `categories/${ID}`
  })
}

// 编辑分类并提交
export const onEidtCate = (data) => {
  return request({
    method: 'PUT',
    url: `categories/${data.cat_id}`,
    data
  })
}

// 删除分类
export const onRemoveCate = (ID) => {
  return request({
    method: 'DELETE',
    url: `categories/${ID}`
  })
}
