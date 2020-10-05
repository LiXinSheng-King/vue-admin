import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import User from '@/views/User'
import Welcome from '@/views/Welcome'
import Rights from '@/views/Power/Rights'
import Roles from '@/views/Power/Roles'
import Cates from '@/views/Goods/Cates'
import Params from '@/views/Goods/Params'
import List from '@/views/Goods/List'
import AddGoods from '@/views/Goods/AddGoods'

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
        component: User
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
        component: Cates
      },
      {
        path: '/params',
        name: 'params',
        component: Params
      },
      {
        path: '/goods',
        name: 'goods',
        component: List
      },
      {
        path: '/goods/add',
        name: 'AddGoods',
        component: AddGoods
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
