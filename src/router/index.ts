import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

const routes = [
  // Landing Pública — Transparencia de cobros
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/LandingView.vue'),
    meta: { requiresAuth: false, layout: 'public' }
  },
  // Login de cobrador/admin
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, layout: 'public' }
  },
  // PWA Cobrador — requiere autenticación
  {
    path: '/cobrar',
    name: 'cobrar',
    component: () => import('@/views/CobroView.vue'),
    meta: { requiresAuth: true, layout: 'cobro' }
  },
  // Catch-all → Landing
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de autenticación
router.beforeEach(async (to, _from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirigir a login si requiere auth
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Si ya está logueado y va a /login, redirigir a cobrar
    next('/cobrar')
  } else {
    next()
  }
})

export default router