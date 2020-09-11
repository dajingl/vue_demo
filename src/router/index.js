import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/page/home'
import test from '@/page/test'
const routers = [
  {
    path: '/home',
    name: 'home',
    component: Home,
    children: [
      {
        path: 'test',
        name: 'test',
        component: test
      }
    ]
  }
]


// router
Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
	base: '/',
  routes: routers
})


export default router

