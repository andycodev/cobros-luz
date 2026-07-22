<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
    <div class="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
      <!-- Marca -->
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 bg-gradient-to-br from-primary-800 to-primary-500 rounded-lg flex items-center justify-center shadow-md shadow-primary-800/20">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <div class="leading-tight">
          <p class="text-xs font-black text-slate-900 tracking-tight font-outfit uppercase">Cobros Luz</p>
          <p v-if="cobrador" class="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">{{ cobrador }}</p>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex items-center gap-2">
        <!-- Indicador Admin -->
        <span v-if="rol === 'admin'" class="flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 uppercase tracking-wide">
          <BoltIcon class="w-3 h-3 text-amber-600 flex-shrink-0" />
          Admin
        </span>

        <!-- Indicador de sesión activa -->
        <span v-else class="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1 uppercase tracking-wide">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
          En línea
        </span>

        <!-- Botón logout -->
        <button
          id="btn-logout"
          @click="$emit('logout')"
          class="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl px-3 py-2 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span class="hidden sm:inline">Salir</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { BoltIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  user: any | null
  rol?: string
}>()

defineEmits(['logout'])

const cobrador = computed(() => {
  if (!props.user) return null
  return props.user.user_metadata?.nombre || props.user.email || 'Cobrador'
})
</script>
