// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import Login from '@/views/Login'
// import Home from '@/views/Home'
// import User from '@/views/User'
// import Welcome from '@/views/Welcome'
// import Rights from '@/views/Power/Rights'
// import Roles from '@/views/Power/Roles'
// import Cates from '@/views/Goods/Cates'
// import Params from '@/views/Goods/Params'
// import List from '@/views/Goods/List'
// import AddGoods from '@/views/Goods/AddGoods'
// import Order from '@/views/Goods/Order'
// import Report from '@/views/Report'

import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Login/index.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Home/index.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Welcome/index.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/User/index.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/Power/Rights/index.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/Power/Roles/index.vue')

const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../views/Goods/Cates/index.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../views/Goods/Params/index.vue')

const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ '../views/Goods/List/index.vue')
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../views/Goods/AddGoods/index.vue')

const Order = () => import(/* webpackChunkName: "Order_Report" */ '../views/Goods/Order/index.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../views/Report/index.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: Home,
    children: [
      {
        path: '/welcome',
        name: 'welocme',
        component: Welcome
      },
      {
        path: '/users',
        name: 'user',
        component: Users
      },
      {
        path: '/rights',
        name: 'rights',
        component: Rights
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles
      },
      {
        path: '/categories',
        name: 'cates',
        component: Cate
      },
      {
        path: '/params',
        name: 'params',
        component: Params
      },
      {
        path: '/goods',
        name: 'goods',
        component: GoodsList
      },
      {
        path: '/goods/add',
        name: 'AddGoods',
        component: Add
      },
      {
        path: '/orders',
        name: 'order',
        component: Order
      },
      {
        path: '/reports',
        name: 'report',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
