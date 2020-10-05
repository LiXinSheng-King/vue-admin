import request from '@/utils/request.js'

// 商品列表数据
export const onGetGoodsList = (params) => {
  return request({
    method: 'GET',
    url: '/goods',
    params
  })
}

// 删除商品
export const onRemoveById = (ID) => {
  return request({
    method: 'DELETE',
    url: `goods/${ID}`
  })
}

// 商品分类列表
export const onGetCateList = (params) => {
  return request({
    method: 'GET',
    url: '/categories',
    params
  })
}

// 商品参数中分类参数渲染
export const onTabClicked = (params) => {
  return request({
    method: 'GET',
    url: `categories/${params.id}/attributes`,
    params
  })
}

// 添加商品
export const onAddGoods = (data) => {
  return request({
    method: 'POST',
    url: 'goods',
    data
  })
}
