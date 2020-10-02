// 基于axios封装的请求模块

import axios from 'axios'

// 创建一个axios实例，就是复制一个axios
// 通过这个实例去发请求，把需要的配置配置到这个实例里面

const request = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/' // 请求的基础路径
})

// 请求拦截器
request.interceptors.request.use(
  // 任何的，所有的请求都会经过这里
  // config 是当前请求相关的配置信息对象
  // config 是可以修改的
  function (config) {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 如果有登录用户信息， 则统一设置 token

    // 然后就可以在允许请求发送出去之前定制统一的业务功能处理
    // 例如： 统一的设置token

    // 当这里 return config 之后请求才是真正的发出去
    return config
  }
)

// 导出请求模块
export default request

// 谁用谁就加载request模块
// import request from 'request.js'
// request.xxx
// request({
//   method: ,
//   url: ''
// })
