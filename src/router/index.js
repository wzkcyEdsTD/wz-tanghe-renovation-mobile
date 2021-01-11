import Vue from 'vue'
import VueRouter from 'vue-router'
import SourceLayer from '../views/SourceLayer'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'SourceLayer',
    component: SourceLayer
  },
  {
    path: '/decision',
    name: 'Decision',
    component: () => import( /* webpackChunkName: "decision" */ '../views/Decision.vue')
  },
  {
    path: '/mark',
    name: 'Mark',
    component: () => import( /* webpackChunkName: "about" */ '../views/Mark.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router