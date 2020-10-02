import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Welcome from '@/views/Welcome'
import User from '@/views/User'

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
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
