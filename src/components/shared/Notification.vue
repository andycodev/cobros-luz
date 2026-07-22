<template>
  <div class="toast toast-top toast-end z-[9999]">
    <Transition name="notification">
      <div v-if="show" :class="['alert shadow-xl text-white rounded-2xl flex items-center gap-3 px-4 py-3 border border-white/20', typeClass]">
        <component :is="notificationIcon" class="w-5 h-5 flex-shrink-0" />
        <span class="text-xs font-bold font-sans">{{ message }}</span>
        <button @click="$emit('close')" class="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors ml-auto">
          <XMarkIcon class="w-3.5 h-3.5" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/solid'

const props = defineProps({
  message: { type: String, required: true },
  type: { type: String, default: 'alert-info' }, // alert-success, alert-error, etc.
  duration: { type: Number, default: 3000 },
  show: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

const notificationIcon = computed(() => {
  if (props.type.includes('success')) return CheckCircleIcon
  if (props.type.includes('error') || props.type.includes('warning')) return ExclamationCircleIcon
  return InformationCircleIcon
})

const typeClass = computed(() => {
  if (props.type.includes('success')) return 'bg-emerald-600'
  if (props.type.includes('error')) return 'bg-red-600'
  if (props.type.includes('warning')) return 'bg-amber-600'
  return 'bg-slate-800'
})

// Watcher para cerrar automáticamente cuando 'show' pase a true
watch(() => props.show, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emit('close')
    }, props.duration)
  }
})
</script>

<style scoped>
/* Animación suave de entrada por la derecha y salida */
.notification-enter-active,
.notification-leave-active {
    transition: all 0.4s ease;
}

.notification-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.notification-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>