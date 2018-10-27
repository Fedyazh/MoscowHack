import Vue from 'vue'
import Router from 'vue-router'
import ContentCards from '@/components/ContentCards'
import Auth from '@/components/Auth'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/Cards',
      name: 'Content',
      component: ContentCards
    },
    {
      path: '/Auth/:modePage',
      name: 'Auth',
      component: Auth
    },
    {
      path: '/',
      redirect: { name: 'Content' }
    },
    {
      path: '*',
      redirect: {name: 'Content'}
    },
  ]
})
