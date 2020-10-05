import request from '@/utils/request'

// 订单数据
export const onGetOrderList = (params) => {
  return request({
    method: 'GET',
    url: '/orders',
    params
  })
}

// 查看物流信息
export const onShowProgressDialog = (params) => {
  return request({
    method: 'GET',
    url: `/kuaidi/${params.id}`,
    params
  })
}
