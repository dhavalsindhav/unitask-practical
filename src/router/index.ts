import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'user',
      children: [
        {
          path: '',
          name: 'users',
          component: () => import('../views/Users/userList.vue')
        },
      ],
    },
   
  ]
})

export default router
