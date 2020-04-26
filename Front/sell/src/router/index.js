import Vue from 'vue'
import VueRouter from 'vue-router'

// import HelloWorld from '@/components/HelloWorld'
import ratings from '../components/ratings/ratings'
import seller from '../components/seller/seller'
import goods from '../components/goods/goods'
Vue.use(VueRouter)

const routes = [
  {
    path: '/goods',
    component: goods
  },
  {
    path: '/seller',
    component: seller
  },
  {
    path: '/ratings',
    component: ratings
  }
]

var router = new VueRouter({
  routes
})
export default router
