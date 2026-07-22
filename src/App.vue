<template>
  <div class="min-h-screen flex flex-col font-sans">
    <!-- Layout Cobrador — con header propio -->
    <div v-if="currentRoute.meta.layout === 'cobro'" class="flex flex-col min-h-screen sm:h-screen sm:overflow-hidden bg-slate-50">
      <CobrosHeader :user="user" :rol="userRol" @logout="handleLogout" />
      <main class="flex-1 sm:overflow-hidden">
        <router-view />
      </main>
    </div>

    <!-- Layout Público — solo la vista (Landing, Login) -->
    <div v-else class="flex-1 flex flex-col">
      <router-view />
    </div>

    <!-- Notificaciones Globales -->
    <div class="fixed top-4 right-4 pointer-events-none z-[9999]">
      <div class="pointer-events-auto">
        <Notification v-bind="notificationState" @close="notificationState.show = false" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import CobrosHeader from '@/components/CobrosHeader.vue'
import Notification from '@/components/shared/Notification.vue'
import { notificationState, showNotification } from '@/events/notificationEvents'
import '@/events/pwaInstall'

const currentRoute = useRoute()
const router = useRouter()
const user = ref<any>(null)
const userRol = ref<string>('cobrador')

async function loadProfile(userId: string) {
  try {
    const { data } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', userId)
      .maybeSingle()
    if (data?.rol) {
      userRol.value = data.rol
    }
  } catch (err) {
    console.error('Error cargando rol en App.vue:', err)
  }
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user || null
  if (session?.user?.id) {
    loadProfile(session.user.id)
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
    if (session?.user?.id) {
      loadProfile(session.user.id)
    } else {
      userRol.value = 'cobrador'
    }
  })
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  user.value = null
  showNotification('Sesión cerrada correctamente.', 'alert-info')
  router.push('/login')
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>