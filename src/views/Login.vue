<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 relative overflow-hidden font-sans">
    <!-- Fondo decorativo -->
    <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-100/50 blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-sky-100/40 blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-sm relative z-10">
      <!-- Card principal -->
      <div class="bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-slate-200/80 p-7">

        <!-- Header / Branding -->
        <div class="text-center mb-7">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-900 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-800/25 transform hover:scale-105 transition-transform duration-300">
            <!-- Ícono de rayo -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight font-outfit">Cobros de Luz</h1>
          <p class="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mt-1">Cancha Sintética · Acceso Cobrador</p>
        </div>

        <!-- Formulario de Login -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-0.5 tracking-widest">
              Correo
            </label>
            <input
              v-model="email"
              type="email"
              id="email"
              required
              autocomplete="email"
              placeholder="cobrador@cancha.com"
              class="input-field text-sm"
            />
          </div>

          <div>
            <label for="password" class="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-0.5 tracking-widest">
              Contraseña
            </label>
            <input
              v-model="password"
              type="password"
              id="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="input-field text-sm"
            />
          </div>

          <!-- Error inline -->
          <div v-if="errorMsg" class="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p class="text-xs text-red-600 font-medium">{{ errorMsg }}</p>
          </div>

          <!-- Botón de ingreso -->
          <button
            id="btn-login"
            type="submit"
            :disabled="loading"
            class="btn-primary w-full py-4 text-sm uppercase tracking-widest flex items-center justify-center gap-2 min-h-[52px] mt-2"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            <span>{{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}</span>
          </button>
        </form>

        <!-- Enlace a la Landing pública -->
        <div class="text-center mt-6 pt-5 border-t border-slate-100">
          <router-link
            id="link-ver-cobros-publicos"
            to="/"
            class="inline-flex items-center gap-1.5 text-[10px] font-black text-primary-500 hover:text-primary-700 uppercase tracking-widest transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.573-3.007-9.964-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Ver cobros públicos
          </router-link>
        </div>
      </div>

      <!-- Leyenda de seguridad -->
      <p class="text-center text-[10px] text-slate-400 mt-4 font-medium">
        Solo personal autorizado · Tus datos están protegidos
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { showNotification } from '@/events/notificationEvents'

const router   = useRouter()
const email    = ref('')
const password = ref('')
const loading  = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  if (loading.value) return
  loading.value = true
  errorMsg.value = ''

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email:    email.value.trim(),
      password: password.value,
    })

    if (error) throw error

    showNotification('¡Bienvenido/a! Sesión iniciada.', 'alert-success')
    router.push('/cobrar')
  } catch (err: any) {
    errorMsg.value = err.message?.includes('Invalid login')
      ? 'Credenciales incorrectas. Verifica tu correo y contraseña.'
      : err.message || 'Error al iniciar sesión. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}
</script>
