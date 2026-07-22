<template>
  <div class="h-full min-h-[calc(100vh-56px)] sm:min-h-0 bg-slate-50 font-sans flex flex-col justify-center items-center px-4 py-4 sm:py-2 overflow-x-hidden">
    <div class="max-w-lg w-full mx-auto my-auto">

      <!-- ════════════════════════════════════════════════ -->
      <!--  FORMULARIO DE COBRO                            -->
      <!-- ════════════════════════════════════════════════ -->
      <div class="card-surface p-5 shadow-sm">
        <!-- Título del formulario -->
        <div class="flex items-center justify-between gap-3 mb-5">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <h2 class="text-sm font-black text-slate-800 uppercase tracking-wide">Nuevo Cobro</h2>
          </div>

          <!-- Botón Ver Historial -->
          <button
            id="btn-abrir-drawer-historial"
            type="button"
            @click="abrirDrawerHistorial"
            class="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2 shadow-sm transition-all duration-200 active:scale-95"
          >
            <ClockIcon class="w-4 h-4 text-emerald-400" />
            <span>Ver Historial</span>
          </button>
        </div>

        <form @submit.prevent="guardarCobro" class="space-y-5">

          <!-- ── MONTO ─────────────────────────────────── -->
          <div>
            <label for="monto" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Monto (S/)
            </label>
            <!-- Display del monto actual -->
            <div
              class="w-full bg-primary-950 rounded-2xl px-5 py-4 mb-3 text-center cursor-text"
              @click="$refs.montoInput?.focus()"
            >
              <span class="text-4xl font-black text-white font-outfit tracking-tight">
                S/ {{ montoDisplay || '0.00' }}
              </span>
            </div>

            <!-- Input numérico oculto accesible -->
            <input
              ref="montoInput"
              id="monto"
              v-model="montoRaw"
              type="number"
              inputmode="decimal"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              class="sr-only"
              required
            />

            <!-- Botones de acceso rápido -->
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="val in montosRapidos"
                :key="val"
                type="button"
                :id="`btn-monto-${val}`"
                @click="setMonto(val)"
                :class="[
                  'py-3 rounded-xl text-sm font-black transition-all duration-150 active:scale-95',
                  Number(montoRaw) === val
                    ? 'bg-primary-800 text-white shadow-md shadow-primary-800/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-primary-50 hover:text-primary-800'
                ]"
              >
                {{ val }}
              </button>
            </div>

            <!-- Input manual visible -->
            <div class="mt-3">
              <input
                id="monto-manual"
                v-model="montoRaw"
                type="number"
                inputmode="decimal"
                step="0.01"
                min="0.01"
                placeholder="Otro monto..."
                class="input-field text-center text-base font-bold"
                @input="montoRaw = $event.target.value"
              />
            </div>
          </div>

          <!-- ── QUIÉN PAGÓ ─────────────────────────────── -->
          <div>
            <label for="pagado-por" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              ¿Quién pagó?
            </label>
            <input
              id="pagado-por"
              v-model="form.pagado_por"
              type="text"
              placeholder="Nombre o delegado del equipo"
              class="input-field text-sm"
              required
              autocomplete="off"
            />
          </div>

          <!-- ── MÉTODO DE PAGO ─────────────────────────── -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Método de Pago
            </label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="metodo in metodos"
                :key="metodo.valor"
                type="button"
                :id="`btn-metodo-${metodo.valor.toLowerCase()}`"
                @click="form.metodo_pago = metodo.valor"
                :class="[
                  'flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border-2 transition-all duration-150 active:scale-95',
                  form.metodo_pago === metodo.valor
                    ? 'border-primary-500 bg-primary-50 shadow-sm shadow-primary-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                ]"
              >
                <component :is="getMetodoIcon(metodo.valor)" class="w-6 h-6" :class="metodoIconColor(metodo.valor)" />
                <span :class="['text-[9px] font-black uppercase tracking-wide', form.metodo_pago === metodo.valor ? 'text-primary-700' : 'text-slate-500']">
                  {{ metodo.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- ── NOTA OPCIONAL ──────────────────────────── -->
          <div>
            <label for="nota" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Nota <span class="text-slate-300 font-medium normal-case tracking-normal">(opcional)</span>
            </label>
            <textarea
              id="nota"
              v-model="form.nota"
              rows="2"
              placeholder="Ej: 10 jugadores equipo Alvarado..."
              class="input-field text-sm resize-none"
            ></textarea>
          </div>

          <!-- ── BOTÓN GUARDAR ──────────────────────────── -->
          <button
            id="btn-guardar-cobro"
            type="submit"
            :disabled="guardando || !montoRaw || !form.pagado_por.trim()"
            class="btn-primary w-full py-4 text-sm uppercase tracking-widest flex items-center justify-center gap-2 min-h-[54px]"
          >
            <!-- Spinner -->
            <svg v-if="guardando" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <!-- Check éxito -->
            <svg v-else-if="exitoso" class="h-5 w-5 text-white animate-pulse-once" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <!-- Ícono normal -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ guardando ? 'Guardando...' : exitoso ? '¡Guardado!' : 'Registrar Cobro' }}</span>
          </button>
        </form>
      </div>

    <!-- ════════════════════════════════════════════════ -->
    <!--  DRAWER LATERAL: HISTORIAL DEL PERÍODO          -->
    <!-- ════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="drawer">
        <div
          v-if="showDrawer"
          class="fixed inset-0 z-[9990] flex justify-end bg-slate-950/60 backdrop-blur-sm"
          @click.self="cerrarDrawerHistorial"
        >
          <div class="bg-white w-full sm:w-[460px] h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-100 transform transition-all duration-300">
            
            <!-- Header del Drawer -->
            <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <ClockIcon class="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 class="text-base font-black tracking-tight font-outfit">Historial del Período</h3>
                  <p class="text-[10px] text-white/60 font-medium">Registros del mes actual</p>
                </div>
              </div>

              <button
                @click="cerrarDrawerHistorial"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                title="Cerrar (Esc)"
              >
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>

            <!-- Contenido del Drawer -->
            <div class="p-5 overflow-y-auto flex-1 space-y-4 custom-scrollbar">

              <!-- Selector de Filtro para Admin -->
              <div v-if="userRol === 'admin'" class="bg-slate-100 p-1 rounded-2xl flex items-center justify-between gap-1">
                <button
                  @click="cambiarFiltroAdmin('mis')"
                  :class="['flex-1 py-2 text-xs font-black rounded-xl transition-all', modoFiltroAdmin === 'mis' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
                >
                  Mis cobros
                </button>
                <button
                  @click="cambiarFiltroAdmin('todos')"
                  :class="['flex-1 py-2 text-xs font-black rounded-xl transition-all', modoFiltroAdmin === 'todos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
                >
                  Todos los cobros (Admin)
                </button>
              </div>

              <!-- Tarjeta Resumen Financiero del Período -->
              <div class="bg-slate-900 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest text-emerald-400">Total Período</p>
                  <p class="text-2xl font-black font-outfit mt-0.5">S/ {{ formatMonto(resumenDrawer.totalMonto) }}</p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-1.5 rounded-xl text-right">
                  <span class="text-xs font-bold text-emerald-300">{{ resumenDrawer.totalCobros }}</span>
                  <span class="text-[10px] text-white/60 block font-medium">cobro{{ resumenDrawer.totalCobros !== 1 ? 's' : '' }}</span>
                </div>
              </div>

              <!-- Lista de Registros -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-xs font-black text-slate-700 uppercase tracking-widest">Detalle de Registros</h4>
                  <span class="text-[10px] text-slate-400 font-medium">{{ historial.length }} registro{{ historial.length !== 1 ? 's' : '' }}</span>
                </div>

                <!-- Carga con Skeleton -->
                <div v-if="loadingHistorial" class="space-y-2">
                  <div v-for="i in 4" :key="i" class="h-14 bg-slate-100 rounded-2xl animate-pulse"></div>
                </div>

                <!-- Estado Vacío -->
                <div v-else-if="historial.length === 0" class="card-surface p-8 text-center border-dashed">
                  <p class="text-xs font-bold text-slate-400">No hay registros de cobros en este período.</p>
                </div>

                <!-- Lista Desglosada -->
                <div v-else class="space-y-2.5">
                  <div
                    v-for="c in historial"
                    :key="c.id"
                    class="card-surface p-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <div class="flex items-center gap-3 min-w-0">
                        <div :class="['w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', metodoBg(c.metodo_pago)]">
                          <component :is="getMetodoIcon(c.metodo_pago)" class="w-5 h-5" :class="metodoIconColor(c.metodo_pago)" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs font-bold text-slate-800 truncate">{{ c.pagado_por }}</p>
                          <div class="flex items-center gap-2 mt-0.5">
                            <span :class="['badge-metodo text-[9px]', metodoBadge(c.metodo_pago)]">
                              {{ c.metodo_pago }}
                            </span>
                            <span class="text-[10px] text-slate-400">{{ formatFechaCompleta(c.created_at) }}</span>
                          </div>
                          <p v-if="c.nota" class="text-[10px] text-slate-400 italic truncate mt-0.5">"{{ c.nota }}"</p>
                        </div>
                      </div>

                      <div class="flex items-center gap-2 flex-shrink-0">
                        <p class="text-sm font-black text-emerald-700 font-outfit">S/ {{ formatMonto(c.monto) }}</p>

                        <!-- Botones de Administrador -->
                        <div v-if="userRol === 'admin'" class="flex items-center gap-1 border-l border-slate-100 pl-1.5">
                          <button
                            @click="abrirModalEditar(c)"
                            class="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Editar cobro"
                          >
                            <PencilSquareIcon class="w-4 h-4" />
                          </button>
                          <button
                            @click="abrirModalEliminar(c)"
                            class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar cobro"
                          >
                            <TrashIcon class="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Footer del Drawer -->
            <div class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cancha Sintética Huaca Blanca</span>
              <button @click="cerrarDrawerHistorial" class="btn-secondary py-1.5 px-4 text-xs font-bold">Cerrar</button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

      <!-- Enlace a la Landing -->
      <div class="mt-3 text-center">
        <router-link
          id="link-ver-transparencia"
          to="/"
          class="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary-500 hover:text-primary-700 uppercase tracking-widest transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.573-3.007-9.964-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Ver transparencia pública
        </router-link>
      </div>

    <!-- ════════════════════════════════════════════════ -->
    <!--  MODAL EDITAR COBRO (SOLO ADMIN)                -->
    <!-- ════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md" @click.self="cerrarModalEditar">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <PencilSquareIcon class="w-4 h-4" />
                </div>
                <h3 class="text-sm font-black text-slate-900 font-outfit uppercase">Editar Cobro</h3>
              </div>
              <button @click="cerrarModalEditar" class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">✕</button>
            </div>

            <form @submit.prevent="guardarEdicion" class="space-y-4">
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monto (S/)</label>
                <input v-model="editForm.monto" type="number" step="0.01" min="0.01" class="input-field text-sm font-bold" required />
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pagado Por</label>
                <input v-model="editForm.pagado_por" type="text" class="input-field text-sm font-bold" required />
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Método de Pago</label>
                <select v-model="editForm.metodo_pago" class="input-field text-sm font-bold">
                  <option value="Efectivo">Efectivo</option>
                  <option value="Yape">Yape</option>
                  <option value="Plin">Plin</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nota / Observación</label>
                <input v-model="editForm.nota" type="text" class="input-field text-sm" placeholder="Opcional..." />
              </div>

              <div class="flex items-center justify-end gap-2 pt-2">
                <button type="button" @click="cerrarModalEditar" class="btn-secondary text-xs px-4 py-2">Cancelar</button>
                <button type="submit" :disabled="guardandoEdicion" class="btn-primary text-xs px-4 py-2 bg-amber-600 hover:bg-amber-500">
                  {{ guardandoEdicion ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ════════════════════════════════════════════════ -->
    <!--  MODAL ELIMINAR COBRO (SOLO ADMIN)              -->
    <!-- ════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md" @click.self="cerrarModalEliminar">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 p-6 space-y-4 text-center">
            <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <TrashIcon class="w-6 h-6" />
            </div>
            <h3 class="text-base font-black text-slate-900 font-outfit">¿Eliminar Cobro?</h3>
            <p v-if="cobroEnEliminacion" class="text-xs text-slate-500">
              Estás a punto de borrar el cobro de <strong class="text-slate-800">S/ {{ formatMonto(cobroEnEliminacion.monto) }}</strong> realizado por <strong class="text-slate-800">{{ cobroEnEliminacion.pagado_por }}</strong>. Esta acción no se puede deshacer.
            </p>
            <div class="flex items-center justify-center gap-3 pt-2">
              <button @click="cerrarModalEliminar" class="btn-secondary text-xs px-4 py-2.5 flex-1">Cancelar</button>
              <button @click="confirmarEliminacion" :disabled="eliminandoCobro" class="bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl px-4 py-2.5 flex-1 shadow-md shadow-red-600/20 active:scale-95 disabled:opacity-50">
                {{ eliminandoCobro ? 'Eliminando...' : 'Sí, Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { showNotification } from '@/events/notificationEvents'
import {
  BanknotesIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  PencilSquareIcon,
  TrashIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/vue/24/solid'
import { format, parseISO, startOfMonth, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'

// ── Tipos ──────────────────────────────────────────────────
interface Cobro {
  id: number
  created_at: string
  cobrador_id: string | null
  monto: number
  pagado_por: string
  metodo_pago: string
  nota: string | null
}

// ── Constantes ──────────────────────────────────────────────
const montosRapidos = [5, 10, 12, 15, 20]

const metodos = [
  { valor: 'Efectivo',      label: 'Efectivo' },
  { valor: 'Yape',          label: 'Yape'     },
  { valor: 'Plin',          label: 'Plin'     },
  { valor: 'Transferencia', label: 'Transf.'  },
]

// ── Estado ──────────────────────────────────────────────────
const montoRaw = ref<string>('')
const form = ref({
  pagado_por:  '',
  metodo_pago: 'Efectivo',
  nota:        '',
})
const guardando = ref(false)
const exitoso   = ref(false)
const historial = ref<Cobro[]>([])
const montoInput = ref<HTMLInputElement | null>(null)

// Rol y Gestión Admin
const userRol = ref<'admin' | 'cobrador'>('cobrador')
const modoFiltroAdmin = ref<'mis' | 'todos'>('mis')

const showEditModal = ref(false)
const showDeleteModal = ref(false)
const loadingHistorial = ref(false)
const showDrawer = ref(false)

const cobroEnEdicion = ref<Cobro | null>(null)
const cobroEnEliminacion = ref<Cobro | null>(null)

const editForm = ref({
  monto: 0,
  pagado_por: '',
  metodo_pago: 'Efectivo',
  nota: ''
})

const guardandoEdicion = ref(false)
const eliminandoCobro = ref(false)

// ── Computed ────────────────────────────────────────────────
const montoDisplay = computed(() => {
  const n = parseFloat(montoRaw.value)
  if (isNaN(n) || n <= 0) return ''
  return n.toFixed(2)
})

const resumenDrawer = computed(() => {
  const totalMonto = historial.value.reduce((acc, c) => acc + Number(c.monto), 0)
  const totalCobros = historial.value.length
  return { totalMonto, totalCobros }
})

// ── Control del Drawer ──────────────────────────────────────
function abrirDrawerHistorial() {
  showDrawer.value = true
  cargarHistorial()
}

function cerrarDrawerHistorial() {
  showDrawer.value = false
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showDrawer.value) {
    cerrarDrawerHistorial()
  }
}

// ── Helpers ──────────────────────────────────────────────────
function setMonto(val: number) {
  montoRaw.value = String(val)
}

function formatMonto(val: number): string {
  return Number(val).toFixed(2)
}

function formatHora(iso: string): string {
  try {
    return format(parseISO(iso), 'hh:mm a', { locale: es })
  } catch {
    return '—'
  }
}

function formatFechaCompleta(iso: string): string {
  try {
    return format(parseISO(iso), 'dd MMM · hh:mm a', { locale: es })
  } catch {
    return '—'
  }
}

function metodoBadge(metodo: string): string {
  const map: Record<string, string> = {
    'Efectivo':      'bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold',
    'Yape':          'bg-purple-50 text-purple-700 border border-purple-100 font-bold',
    'Plin':          'bg-sky-50 text-sky-700 border border-sky-100 font-bold',
    'Transferencia': 'bg-amber-50 text-amber-700 border border-amber-100 font-bold',
  }
  return map[metodo] ?? 'bg-slate-50 text-slate-600 border border-slate-100 font-bold'
}

function getMetodoIcon(metodo: string) {
  switch (metodo) {
    case 'Efectivo':      return BanknotesIcon
    case 'Yape':          return DevicePhoneMobileIcon
    case 'Plin':          return QrCodeIcon
    case 'Transferencia': return BuildingLibraryIcon
    default:              return CreditCardIcon
  }
}

function metodoIconColor(metodo: string): string {
  switch (metodo) {
    case 'Efectivo':      return 'text-emerald-600'
    case 'Yape':          return 'text-purple-600'
    case 'Plin':          return 'text-sky-600'
    case 'Transferencia': return 'text-amber-600'
    default:              return 'text-slate-600'
  }
}

function metodoBg(metodo: string): string {
  const map: Record<string, string> = {
    'Efectivo':      'bg-emerald-50',
    'Yape':          'bg-purple-50',
    'Plin':          'bg-sky-50',
    'Transferencia': 'bg-amber-50',
  }
  return map[metodo] ?? 'bg-slate-50'
}

// ── Lógica Admin (Edición y Eliminación) ───────────────────
function cambiarFiltroAdmin(modo: 'mis' | 'todos') {
  modoFiltroAdmin.value = modo
  cargarHistorial()
}

function abrirModalEditar(cobro: Cobro) {
  cobroEnEdicion.value = cobro
  editForm.value = {
    monto: Number(cobro.monto),
    pagado_por: cobro.pagado_por,
    metodo_pago: cobro.metodo_pago,
    nota: cobro.nota || ''
  }
  showEditModal.value = true
}

function cerrarModalEditar() {
  showEditModal.value = false
  cobroEnEdicion.value = null
}

async function guardarEdicion() {
  if (!cobroEnEdicion.value || guardandoEdicion.value) return
  if (editForm.value.monto <= 0 || !editForm.value.pagado_por.trim()) {
    showNotification('Por favor completa el monto y quién realizó el pago.', 'alert-error')
    return
  }

  guardandoEdicion.value = true
  try {
    const { error } = await supabase
      .from('cobros')
      .update({
        monto: Number(editForm.value.monto),
        pagado_por: editForm.value.pagado_por.trim(),
        metodo_pago: editForm.value.metodo_pago,
        nota: editForm.value.nota.trim() || null
      })
      .eq('id', cobroEnEdicion.value.id)

    if (error) throw error

    showNotification('Cobro actualizado correctamente.', 'alert-success')
    cerrarModalEditar()
    cargarHistorial()
  } catch (err: any) {
    console.error('Error editando cobro:', err)
    showNotification('Error al editar: ' + (err.message || 'Error en la base de datos'), 'alert-error')
  } finally {
    guardandoEdicion.value = false
  }
}

function abrirModalEliminar(cobro: Cobro) {
  cobroEnEliminacion.value = cobro
  showDeleteModal.value = true
}

function cerrarModalEliminar() {
  showDeleteModal.value = false
  cobroEnEliminacion.value = null
}

async function confirmarEliminacion() {
  if (!cobroEnEliminacion.value || eliminandoCobro.value) return
  eliminandoCobro.value = true

  try {
    const { error } = await supabase
      .from('cobros')
      .delete()
      .eq('id', cobroEnEliminacion.value.id)

    if (error) throw error

    showNotification('Cobro eliminado correctamente.', 'alert-success')
    cerrarModalEliminar()
    cargarHistorial()
  } catch (err: any) {
    console.error('Error eliminando cobro:', err)
    showNotification('Error al eliminar: ' + (err.message || 'Error en la base de datos'), 'alert-error')
  } finally {
    eliminandoCobro.value = false
  }
}

// ── Cargar Historial de Cobros ──────────────────────────────
async function cargarHistorial() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (historial.value.length === 0) {
    loadingHistorial.value = true
  }

  try {
    const ahora = new Date()
    const inicioFiltro = userRol.value === 'admin'
      ? startOfMonth(ahora).toISOString()
      : startOfDay(ahora).toISOString()

    let query = supabase
      .from('cobros')
      .select('*')
      .gte('created_at', inicioFiltro)
      .order('created_at', { ascending: false })

    if (userRol.value !== 'admin' || modoFiltroAdmin.value === 'mis') {
      query = query.eq('cobrador_id', user.id)
    }

    const { data, error } = await query.limit(30)
    if (error) throw error
    historial.value = data || []
  } catch (err) {
    console.error('Error cargando historial:', err)
  } finally {
    loadingHistorial.value = false
  }
}

// ── Guardar cobro ───────────────────────────────────────────
async function guardarCobro() {
  if (guardando.value) return

  const monto = parseFloat(montoRaw.value)
  if (isNaN(monto) || monto <= 0) {
    showNotification('Ingresa un monto válido mayor a 0.', 'alert-error')
    return
  }
  if (!form.value.pagado_por.trim()) {
    showNotification('Indica quién realizó el pago.', 'alert-error')
    return
  }

  guardando.value = true

  try {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('cobros')
      .insert({
        monto,
        pagado_por:  form.value.pagado_por.trim(),
        metodo_pago: form.value.metodo_pago,
        nota:        form.value.nota.trim() || null,
        cobrador_id: user?.id || null,
      })
      .select()
      .single()

    if (error) throw error

    // Feedback visual de éxito
    exitoso.value = true
    showNotification(`S/ ${monto.toFixed(2)} registrado correctamente.`, 'alert-success')

    // Resetear formulario
    montoRaw.value = ''
    form.value.pagado_por  = ''
    form.value.metodo_pago = 'Efectivo'
    form.value.nota        = ''

    cargarHistorial()
    setTimeout(() => { exitoso.value = false }, 2000)
  } catch (err: any) {
    console.error('Error guardando cobro:', err)
    showNotification('Error al guardar: ' + (err.message || 'Intenta nuevamente.'), 'alert-error')
  } finally {
    guardando.value = false
  }
}

// ── Lifecycle ───────────────────────────────────────────────
onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Consultar perfil de usuario para verificar si es Admin
  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .maybeSingle()

  if (perfil?.rol === 'admin') {
    userRol.value = 'admin'
    modoFiltroAdmin.value = 'todos'
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Animación del Drawer Lateral (Slide-over desde la derecha) */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active > div,
.drawer-leave-active > div {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-enter-from > div,
.drawer-leave-to > div {
  transform: translateX(100%);
}

.cobro-enter-active {
  animation: slideInFeed 0.4s ease-out;
}
@keyframes slideInFeed {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Área segura para iOS */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 24px);
}
</style>
