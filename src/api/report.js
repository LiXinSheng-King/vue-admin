import request from '@/utils/request'

export const onGetReport = (params) => {
  return request({
    method: 'GET',
    url: 'reports/type/1',
    params
  })
}
