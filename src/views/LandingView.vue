<template>
  <div class="h-screen w-full bg-slate-50 font-sans flex flex-col overflow-hidden">
    <!-- ═══════════════════════════════════════════════════════ -->
    <!--  HERO HEADER                                           -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <header class="relative overflow-hidden bg-slate-900 flex-shrink-0 border-b border-slate-800">
      <!-- Imagen de la Cancha Sintética de fondo (MUCHO MÁS CLARA Y BRICLANTE) -->
      <div class="absolute inset-0 pointer-events-none opacity-80 overflow-hidden">
        <img src="/img/cancha-sintetica.png" alt="Cancha Sintética Iluminada"
          class="w-full h-full object-cover object-center filter brightness-110 contrast-105 saturate-110 scale-105" />
        <!-- Gradient overlay ligero que mantiene la cancha clara y visible -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-black/15"></div>
      </div>

      <!-- Patrón de fondo sutil -->
      <div class="absolute inset-0 opacity-15 pointer-events-none"
        style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.5) 1px, transparent 0); background-size: 28px 28px;">
      </div>

      <div class="relative max-w-4xl mx-auto px-4 pt-6 pb-6 z-10">
        <div class="flex items-center justify-between gap-4">
          <!-- Marca e Info de la Cancha -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <!-- Thumbnail de la Cancha -->
              <div
                class="w-11 h-11 rounded-2xl overflow-hidden border-2 border-emerald-400/60 shadow-lg shadow-black/60 flex-shrink-0 relative group">
                <img src="/img/cancha-sintetica.png" alt="Cancha Sintética Huaca Blanca"
                  class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                <div class="absolute inset-0 bg-slate-950/20 flex items-center justify-center">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
              </div>
              <div>
                <span
                  class="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em] block leading-none">Cancha
                  Sintética Huaca Blanca</span>
                <span class="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5 block">Sistema de
                  Cobro de Luz</span>
              </div>
            </div>

            <h1
              class="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit leading-tight drop-shadow-md">
              Transparencia <span class="text-emerald-400">de Cobros</span>
            </h1>
            <p class="mt-1 text-xs text-slate-200/90 font-medium max-w-xs drop-shadow">
              Registro en tiempo real de todos los cobros de luz de la cancha.
            </p>
          </div>

          <!-- Botón acceso cobrador -->
          <div class="flex-shrink-0">
            <router-link id="btn-acceso-cobrador" to="/login"
              class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl px-4 py-2.5 shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              <span class="hidden sm:inline">Cobrador</span>
            </router-link>
          </div>
        </div>

        <!-- Indicador en vivo -->
        <div class="mt-3 flex items-center gap-2">
          <span
            class="flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
            En vivo
          </span>
          <span class="text-[10px] text-white/30">•</span>
          <span class="text-[10px] text-slate-300 font-medium">Auditado por la comunidad</span>
        </div>
      </div>
    </header>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!--  TARJETAS RESUMEN (FIJAS - HOY, SEMANA, MES)           -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section class="max-w-4xl w-full mx-auto px-4 -mt-3 relative z-10 flex-shrink-0">
      <div class="grid grid-cols-3 gap-3">
        <!-- Hoy -->
        <div id="card-total-hoy" class="card-surface p-3 sm:p-4 text-center">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Hoy</p>
          <div v-if="loadingStats" class="h-6 bg-slate-100 rounded animate-pulse mx-auto w-16"></div>
          <p v-else class="text-lg sm:text-2xl font-black text-primary-800 font-outfit">
            S/ {{ formatMonto(stats.hoy) }}
          </p>
          <p class="text-[9px] text-slate-400 mt-0.5">{{ stats.cobrosHoy }} cobro{{ stats.cobrosHoy !== 1 ? 's' : '' }}
          </p>
        </div>

        <!-- Esta semana -->
        <div id="card-total-semana" class="card-surface p-3 sm:p-4 text-center">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Semana</p>
          <div v-if="loadingStats" class="h-6 bg-slate-100 rounded animate-pulse mx-auto w-20"></div>
          <p v-else class="text-lg sm:text-2xl font-black text-primary-800 font-outfit">
            S/ {{ formatMonto(stats.semana) }}
          </p>
          <p class="text-[9px] text-slate-400 mt-0.5">{{ stats.cobrosSemana }} cobro{{ stats.cobrosSemana !== 1 ? 's' :
            '' }}</p>
        </div>

        <!-- Este mes -->
        <div id="card-total-mes" class="card-surface p-3 sm:p-4 text-center">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Mes Actual</p>
          <div v-if="loadingStats" class="h-6 bg-slate-100 rounded animate-pulse mx-auto w-20"></div>
          <p v-else class="text-lg sm:text-2xl font-black text-primary-800 font-outfit">
            S/ {{ formatMonto(stats.mes) }}
          </p>
          <p class="text-[9px] text-slate-400 mt-0.5">{{ stats.cobrosMes }} cobro{{ stats.cobrosMes !== 1 ? 's' : '' }}
          </p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!--  FEED DEL MES ACTUAL (OCUPA ESPACIO RESTANTE Y SCROLL) -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section class="max-w-4xl w-full mx-auto px-4 mt-4 mb-2 flex-1 min-h-0 flex flex-col overflow-hidden">
      <div class="flex items-center justify-between mb-3 flex-shrink-0 flex-wrap gap-2">
        <div>
          <h2 class="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
            Cobros del Mes
            <span class="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full uppercase">
              {{ nombreMesActual }}
            </span>
          </h2>
          <p class="text-[10px] text-slate-400 font-medium">Mostrando únicamente el periodo actual</p>
        </div>

        <!-- Botón para abrir el Historial Completo / Filtros -->
        <button id="btn-ver-historial" @click="abrirModalHistorial"
          class="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl px-3.5 py-2 shadow-sm transition-all duration-200 active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span>Ver historial completo</span>
        </button>
      </div>

      <!-- Estado de carga -->
      <div v-if="loadingCobros" class="space-y-3 flex-1 overflow-hidden">
        <div v-for="i in 4" :key="i" class="card-surface p-4 animate-pulse">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-slate-100"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 bg-slate-100 rounded w-2/3"></div>
              <div class="h-2 bg-slate-100 rounded w-1/3"></div>
            </div>
            <div class="h-5 bg-slate-100 rounded w-14"></div>
          </div>
        </div>
      </div>

      <!-- Sin cobros este mes -->
      <div v-else-if="cobros.length === 0"
        class="card-surface p-10 text-center flex-1 flex flex-col items-center justify-center">
        <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p class="text-sm font-bold text-slate-400">Sin cobros en {{ nombreMesActual }}</p>
        <p class="text-xs text-slate-300 mt-1">Los pagos de este mes se reflejarán automáticamente</p>
      </div>

      <!-- Lista con Scroll Adaptativo solo si sobrepasa la pantalla del dispositivo -->
      <div v-else class="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        <TransitionGroup name="cobro" tag="div" class="space-y-3">
          <div v-for="cobro in cobros" :key="cobro.id" :id="`cobro-${cobro.id}`"
            class="card-surface p-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div class="flex items-center gap-3">
              <!-- Ícono método de pago -->
              <div
                :class="['w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', metodoBg(cobro.metodo_pago)]">
                <component :is="getMetodoIcon(cobro.metodo_pago)" class="w-5 h-5"
                  :class="metodoIconColor(cobro.metodo_pago)" />
              </div>

              <!-- Info principal -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-slate-800 truncate">{{ cobro.pagado_por }}</p>
                <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span :class="['badge-metodo text-[10px]', metodoBadge(cobro.metodo_pago)]">
                    {{ cobro.metodo_pago }}
                  </span>
                  <span class="text-[10px] text-slate-400">{{ formatFechaCorta(cobro.created_at) }} · {{
                    formatHora(cobro.created_at) }}</span>
                </div>
                <p v-if="cobro.nota" class="text-[10px] text-slate-400 mt-0.5 truncate italic">
                  "{{ cobro.nota }}"
                </p>
              </div>

              <!-- Monto -->
              <div class="flex-shrink-0 text-right">
                <p class="text-base font-black text-primary-800 font-outfit">S/ {{ formatMonto(cobro.monto) }}</p>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!--  MODAL / PANEL: HISTORIAL COMPLETO Y FILTROS DE FECHAS  -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showHistorialModal"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md"
          @click.self="cerrarModalHistorial">
          <div
            class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 transform transition-all">

            <!-- Header de la Modal -->
            <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-black tracking-tight font-outfit">Consulta de Recaudación Histórica</h3>
                  <p class="text-[10px] text-white/50 font-medium">Filtra por rangos o selecciona fechas personalizadas
                  </p>
                </div>
              </div>

              <!-- Botón cerrar -->
              <button @click="cerrarModalHistorial"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                ✕
              </button>
            </div>

            <!-- Contenido de la Modal con Scroll -->
            <div class="p-5 overflow-y-auto flex-1 space-y-5">

              <!-- ── 1. FILTROS RÁPIDOS ─────────────────────── -->
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Filtros Rápidos
                </label>
                <div class="flex flex-wrap gap-2">
                  <button v-for="opcion in opcionesRapidas" :key="opcion.id" @click="seleccionarFiltroRapido(opcion.id)"
                    :class="[
                      'px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95',
                      filtroActivo === opcion.id
                        ? 'bg-primary-900 text-white shadow-md shadow-primary-900/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    ]">
                    {{ opcion.label }}
                  </button>
                </div>
              </div>

              <!-- ── 2. RANGO DE FECHAS PERSONALIZADO ────────── -->
              <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                  Rango Personalizado
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label for="fecha-inicio" class="block text-[10px] font-bold text-slate-400 mb-1">
                      Desde (Fecha inicio)
                    </label>
                    <input id="fecha-inicio" type="date" v-model="fechaInicio" @change="onCustomDateChange"
                      class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-primary-500" />
                  </div>
                  <div>
                    <label for="fecha-fin" class="block text-[10px] font-bold text-slate-400 mb-1">
                      Hasta (Fecha fin)
                    </label>
                    <input id="fecha-fin" type="date" v-model="fechaFin" @change="onCustomDateChange"
                      class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-primary-500" />
                  </div>
                </div>
              </div>

              <!-- ── 3. TARJETA RESUMEN DEL PERIODO CONSULTADO ── -->
              <div
                class="bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest text-primary-300">
                    Recaudación Total
                  </p>
                  <p class="text-2xl sm:text-3xl font-black font-outfit mt-0.5">
                    S/ {{ formatMonto(resumenHistorico.totalMonto) }}
                  </p>
                  <p class="text-[10px] text-white/50 mt-0.5">
                    Periodo: <span class="text-white font-medium">{{ resumenHistorico.etiquetaPeriodo }}</span>
                  </p>
                </div>

                <div class="text-right flex flex-col items-end gap-2">
                  <div
                    class="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-xl">
                    <span class="text-xs font-bold text-primary-200">{{ resumenHistorico.totalCobros }}</span>
                    <span class="text-[10px] text-white/60 font-medium">cobro{{ resumenHistorico.totalCobros !== 1 ? 's'
                      : '' }}</span>
                  </div>

                  <!-- Botón Descargar Voucher Imagen PNG -->
                  <button id="btn-descargar-voucher" @click="descargarVoucherImagen"
                    :disabled="generandoVoucher || cobrosFiltrados.length === 0"
                    class="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black rounded-xl px-3 py-1.5 shadow-md transition-all active:scale-95 disabled:opacity-40">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span class="text-white">{{ generandoVoucher ? 'Generando...' : 'Descargar Voucher PNG' }}</span>
                  </button>
                </div>
              </div>

              <!-- ── 4. DETALLE DE COBROS FILTRADOS ──────────── -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-xs font-black text-slate-700 uppercase tracking-widest">Detalle del Periodo</h4>
                  <span class="text-[10px] text-slate-400 font-medium">{{ cobrosFiltrados.length }} registro{{
                    cobrosFiltrados.length !== 1 ? 's' : '' }}</span>
                </div>

                <!-- Carga de datos filtrados -->
                <div v-if="loadingHistorico" class="space-y-2">
                  <div v-for="i in 3" :key="i" class="h-14 bg-slate-100 rounded-xl animate-pulse"></div>
                </div>

                <!-- Sin cobros en este rango -->
                <div v-else-if="cobrosFiltrados.length === 0" class="card-surface p-8 text-center border-dashed">
                  <p class="text-xs font-bold text-slate-400">No se encontraron cobros en las fechas seleccionadas.</p>
                  <p class="text-[10px] text-slate-300 mt-1">Prueba seleccionando otro rango de fechas o filtro rápido.
                  </p>
                </div>

                <!-- Listado completo filtrado -->
                <div v-else class="space-y-2.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                  <div v-for="cobro in cobrosFiltrados" :key="`hist-${cobro.id}`"
                    class="card-surface p-3.5 hover:bg-slate-50 transition-colors">
                    <div class="flex items-center justify-between gap-3">
                      <div class="flex items-center gap-3 min-w-0">
                        <div
                          :class="['w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', metodoBg(cobro.metodo_pago)]">
                          <component :is="getMetodoIcon(cobro.metodo_pago)" class="w-5 h-5"
                            :class="metodoIconColor(cobro.metodo_pago)" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs font-bold text-slate-800 truncate">{{ cobro.pagado_por }}</p>
                          <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span :class="['badge-metodo text-[9px]', metodoBadge(cobro.metodo_pago)]">
                              {{ cobro.metodo_pago }}
                            </span>
                            <span class="text-[10px] text-slate-400">{{ formatFechaCompleta(cobro.created_at) }}</span>
                          </div>
                          <p v-if="cobro.nota" class="text-[10px] text-slate-400 mt-0.5 truncate italic">
                            "{{ cobro.nota }}"
                          </p>
                        </div>
                      </div>

                      <p class="text-sm font-black text-primary-800 font-outfit flex-shrink-0">
                        S/ {{ formatMonto(cobro.monto) }}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <!-- Footer de la Modal -->
            <div
              class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Auditado en tiempo real</span>
              <button @click="cerrarModalHistorial" class="btn-secondary py-2 px-4 text-xs">
                Cerrar
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Footer -->
    <footer class="text-center py-2 text-[10px] text-slate-300 font-medium uppercase tracking-widest flex-shrink-0">
      Transparencia Cancha Sintética Huaca Blanca · {{ new Date().getFullYear() }}
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import {
  BanknotesIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon,
  BuildingLibraryIcon,
  CreditCardIcon
} from '@heroicons/vue/24/solid'
import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  subMonths,
  startOfMonth,
  endOfMonth,
  parseISO
} from 'date-fns'
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

interface Stats {
  hoy: number
  semana: number
  mes: number
  cobrosHoy: number
  cobrosSemana: number
  cobrosMes: number
}

// ── Estado ──────────────────────────────────────────────────
const cobros = ref<Cobro[]>([])
const loadingCobros = ref(true)
const loadingStats = ref(true)
const stats = ref<Stats>({
  hoy: 0, semana: 0, mes: 0,
  cobrosHoy: 0, cobrosSemana: 0, cobrosMes: 0
})

// Modal e Historial Completo
const showHistorialModal = ref(false)
const loadingHistorico = ref(false)
const generandoVoucher = ref(false)
const cobrosFiltrados = ref<Cobro[]>([])
const filtroActivo = ref<string>('mes_actual') // '7d', '30d', '90d', 'mes_actual', 'mes_anterior', 'custom'
const fechaInicio = ref<string>('')
const fechaFin = ref<string>('')

const opcionesRapidas = [
  // { id: '7d', label: 'Últimos 7 días' },
  //{ id: '30d', label: 'Últimos 30 días' },
  { id: '90d', label: 'Últimos 90 días' },
  { id: 'mes_actual', label: 'Mes actual' },
  { id: 'mes_anterior', label: 'Mes anterior' },
]

let realtimeChannel: any = null
let pollTimer: any = null

// ── Computed ────────────────────────────────────────────────
const nombreMesActual = computed(() => {
  try {
    const nombre = format(new Date(), 'MMMM yyyy', { locale: es })
    return nombre.charAt(0).toUpperCase() + nombre.slice(1)
  } catch {
    return 'Mes Actual'
  }
})

const resumenHistorico = computed(() => {
  const totalMonto = cobrosFiltrados.value.reduce((acc, c) => acc + Number(c.monto), 0)
  const totalCobros = cobrosFiltrados.value.length

  let etiquetaPeriodo = 'Personalizado'
  if (filtroActivo.value === '7d') etiquetaPeriodo = 'Últimos 7 días'
  else if (filtroActivo.value === '30d') etiquetaPeriodo = 'Últimos 30 días'
  else if (filtroActivo.value === '90d') etiquetaPeriodo = 'Últimos 90 días'
  else if (filtroActivo.value === 'mes_actual') etiquetaPeriodo = nombreMesActual.value
  else if (filtroActivo.value === 'mes_anterior') {
    const prevMonth = subMonths(new Date(), 1)
    const n = format(prevMonth, 'MMMM yyyy', { locale: es })
    etiquetaPeriodo = n.charAt(0).toUpperCase() + n.slice(1)
  } else if (fechaInicio.value && fechaFin.value) {
    try {
      const f1 = format(parseISO(fechaInicio.value), 'dd/MM/yyyy')
      const f2 = format(parseISO(fechaFin.value), 'dd/MM/yyyy')
      etiquetaPeriodo = `${f1} al ${f2}`
    } catch {
      etiquetaPeriodo = `${fechaInicio.value} al ${fechaFin.value}`
    }
  }

  return {
    totalMonto,
    totalCobros,
    etiquetaPeriodo
  }
})

// ── Helpers de formato ──────────────────────────────────────
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

function formatFechaCorta(iso: string): string {
  try {
    return format(parseISO(iso), 'dd MMM', { locale: es })
  } catch {
    return '—'
  }
}

function formatFechaCompleta(iso: string): string {
  try {
    return format(parseISO(iso), "dd MMM yyyy · hh:mm a", { locale: es })
  } catch {
    return '—'
  }
}

function metodoBg(metodo: string): string {
  const map: Record<string, string> = {
    'Efectivo': 'bg-emerald-50',
    'Yape': 'bg-purple-50',
    'Plin': 'bg-sky-50',
    'Transferencia': 'bg-amber-50',
  }
  return map[metodo] ?? 'bg-slate-50'
}

function metodoBadge(metodo: string): string {
  const map: Record<string, string> = {
    'Efectivo': 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    'Yape': 'bg-purple-50 text-purple-700 border border-purple-100',
    'Plin': 'bg-sky-50 text-sky-700 border border-sky-100',
    'Transferencia': 'bg-amber-50 text-amber-700 border border-amber-100',
  }
  return map[metodo] ?? 'bg-slate-50 text-slate-600 border border-slate-100'
}

function getMetodoIcon(metodo: string) {
  switch (metodo) {
    case 'Efectivo': return BanknotesIcon
    case 'Yape': return DevicePhoneMobileIcon
    case 'Plin': return QrCodeIcon
    case 'Transferencia': return BuildingLibraryIcon
    default: return CreditCardIcon
  }
}

function metodoIconColor(metodo: string): string {
  switch (metodo) {
    case 'Efectivo': return 'text-emerald-600'
    case 'Yape': return 'text-purple-600'
    case 'Plin': return 'text-sky-600'
    case 'Transferencia': return 'text-amber-600'
    default: return 'text-slate-600'
  }
}

// ── Carga de datos ──────────────────────────────────────────
async function cargarCobros(isSilent = false) {
  if (!isSilent && cobros.value.length === 0) {
    loadingCobros.value = true
  }
  try {
    // Cobros del MES ACTUAL para el feed principal
    const inicioMes = startOfMonth(new Date()).toISOString()
    const { data, error } = await supabase
      .from('cobros')
      .select('*')
      .gte('created_at', inicioMes)
      .order('created_at', { ascending: false })

    if (error) throw error
    if (data) {
      cobros.value = data
    }
  } catch (err) {
    console.error('Error cargando cobros:', err)
  } finally {
    loadingCobros.value = false
  }
}

async function calcularStats(isSilent = false) {
  if (!isSilent && stats.value.hoy === 0 && stats.value.semana === 0 && stats.value.mes === 0) {
    loadingStats.value = true
  }
  try {
    const ahora = new Date()
    const inicioHoy = startOfDay(ahora).toISOString()
    const inicioSemana = subDays(startOfDay(ahora), 7).toISOString()
    const inicioMes = startOfMonth(ahora).toISOString()

    const [resHoy, resSemana, resMes] = await Promise.all([
      supabase.from('cobros').select('monto').gte('created_at', inicioHoy),
      supabase.from('cobros').select('monto').gte('created_at', inicioSemana),
      supabase.from('cobros').select('monto').gte('created_at', inicioMes),
    ])

    const sumar = (arr: { monto: number }[] | null) =>
      (arr || []).reduce((acc, c) => acc + Number(c.monto), 0)

    stats.value = {
      hoy: sumar(resHoy.data),
      semana: sumar(resSemana.data),
      mes: sumar(resMes.data),
      cobrosHoy: resHoy.data?.length ?? 0,
      cobrosSemana: resSemana.data?.length ?? 0,
      cobrosMes: resMes.data?.length ?? 0,
    }
  } catch (err) {
    console.error('Error calculando stats:', err)
  } finally {
    loadingStats.value = false
  }
}

// ── Consulta de Historial Filtrado ──────────────────────────
async function consultarHistorial() {
  loadingHistorico.value = true
  try {
    const ahora = new Date()
    let dInicio: Date
    let dFin: Date = endOfDay(ahora)

    if (filtroActivo.value === '7d') {
      dInicio = subDays(startOfDay(ahora), 7)
    } else if (filtroActivo.value === '30d') {
      dInicio = subDays(startOfDay(ahora), 30)
    } else if (filtroActivo.value === '90d') {
      dInicio = subDays(startOfDay(ahora), 90)
    } else if (filtroActivo.value === 'mes_actual') {
      dInicio = startOfMonth(ahora)
      dFin = endOfMonth(ahora)
    } else if (filtroActivo.value === 'mes_anterior') {
      const prev = subMonths(ahora, 1)
      dInicio = startOfMonth(prev)
      dFin = endOfMonth(prev)
    } else if (fechaInicio.value && fechaFin.value) {
      dInicio = startOfDay(parseISO(fechaInicio.value))
      dFin = endOfDay(parseISO(fechaFin.value))
    } else {
      dInicio = startOfMonth(ahora)
    }

    const { data, error } = await supabase
      .from('cobros')
      .select('*')
      .gte('created_at', dInicio.toISOString())
      .lte('created_at', dFin.toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error
    cobrosFiltrados.value = data || []
  } catch (err) {
    console.error('Error consultando historial:', err)
  } finally {
    loadingHistorico.value = false
  }
}

function seleccionarFiltroRapido(opcionId: string) {
  filtroActivo.value = opcionId
  const ahora = new Date()
  if (opcionId === '7d') {
    fechaInicio.value = format(subDays(ahora, 7), 'yyyy-MM-dd')
    fechaFin.value = format(ahora, 'yyyy-MM-dd')
  } else if (opcionId === '30d') {
    fechaInicio.value = format(subDays(ahora, 30), 'yyyy-MM-dd')
    fechaFin.value = format(ahora, 'yyyy-MM-dd')
  } else if (opcionId === '90d') {
    fechaInicio.value = format(subDays(ahora, 90), 'yyyy-MM-dd')
    fechaFin.value = format(ahora, 'yyyy-MM-dd')
  } else if (opcionId === 'mes_actual') {
    fechaInicio.value = format(startOfMonth(ahora), 'yyyy-MM-dd')
    fechaFin.value = format(endOfMonth(ahora), 'yyyy-MM-dd')
  } else if (opcionId === 'mes_anterior') {
    const prev = subMonths(ahora, 1)
    fechaInicio.value = format(startOfMonth(prev), 'yyyy-MM-dd')
    fechaFin.value = format(endOfMonth(prev), 'yyyy-MM-dd')
  }
  consultarHistorial()
}

function onCustomDateChange() {
  filtroActivo.value = 'custom'
  if (fechaInicio.value && fechaFin.value) {
    consultarHistorial()
  }
}

function abrirModalHistorial() {
  showHistorialModal.value = true
  seleccionarFiltroRapido(filtroActivo.value || 'mes_actual')
}

function cerrarModalHistorial() {
  showHistorialModal.value = false
}

// ── Generación de Comprobante / Voucher PNG ──────────────────
function descargarVoucherImagen() {
  if (generandoVoucher.value || cobrosFiltrados.value.length === 0) return
  generandoVoucher.value = true

  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('No se pudo inicializar el contexto 2D de canvas')

    // Escala 2x Retina para nitidez de impresión e imagen cristalina
    const scale = 2
    const width = 640
    const padding = 28
    const listLimit = Math.min(cobrosFiltrados.value.length, 35)
    const itemHeight = 32
    const headerHeight = 150
    const summaryHeight = 135
    const listHeaderHeight = 36
    const footerHeight = 55

    const totalHeight = headerHeight + summaryHeight + listHeaderHeight + (listLimit * itemHeight) + footerHeight

    canvas.width = width * scale
    canvas.height = totalHeight * scale
    ctx.scale(scale, scale)

    // 1. Fondo principal de la tarjeta comprobante
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, totalHeight)

    // 2. Banner de cabecera (Dark Slate con acento verde esmeralda)
    const gradHeader = ctx.createLinearGradient(0, 0, width, 0)
    gradHeader.addColorStop(0, '#0F172A')
    gradHeader.addColorStop(1, '#064E3B')
    ctx.fillStyle = gradHeader
    ctx.fillRect(0, 0, width, headerHeight)

    // Franja esmeralda decorativa
    ctx.fillStyle = '#10B981'
    ctx.fillRect(0, headerHeight - 4, width, 4)

    // Texto de Marca
    ctx.fillStyle = '#34D399'
    ctx.font = '900 11px sans-serif'
    ctx.fillText('CANCHA SINTÉTICA HUACA BLANCA · CONTROL DE LUZ', padding, 32)

    // Título Principal
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '900 22px sans-serif'
    ctx.fillText('COMPROBANTE DE RECAUDACIÓN', padding, 62)

    // Subtítulo / Rango
    ctx.fillStyle = '#CBD5E1'
    ctx.font = '600 12px sans-serif'
    ctx.fillText(`Periodo: ${resumenHistorico.value.etiquetaPeriodo}`, padding, 88)

    // Fecha de Emisión (Alineada a la derecha)
    const fechaEmision = format(new Date(), "dd/MM/yyyy · hh:mm a", { locale: es })
    ctx.textAlign = 'right'
    ctx.fillStyle = '#94A3B8'
    ctx.font = '500 11px sans-serif'
    ctx.fillText(`Emisión: ${fechaEmision}`, width - padding, 88)
    ctx.textAlign = 'left'

    // 3. Tarjeta Resumen Financiero
    const summaryY = headerHeight + 15
    const summaryW = width - (padding * 2)

    ctx.fillStyle = '#F8FAFC'
    ctx.strokeStyle = '#E2E8F0'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.roundRect(padding, summaryY, summaryW, summaryHeight - 15, 14)
    ctx.fill()
    ctx.stroke()

    // Resumen: Total Recaudado (Izquierda)
    ctx.fillStyle = '#64748B'
    ctx.font = '800 10px sans-serif'
    ctx.fillText('MONTO TOTAL RECAUDADO', padding + 20, summaryY + 28)

    ctx.fillStyle = '#064E3B'
    ctx.font = '900 26px sans-serif'
    ctx.fillText(`S/ ${formatMonto(resumenHistorico.value.totalMonto)}`, padding + 20, summaryY + 60)

    // Resumen: Cantidad de cobros (Derecha)
    ctx.textAlign = 'right'
    ctx.fillStyle = '#64748B'
    ctx.font = '800 10px sans-serif'
    ctx.fillText('TOTAL REGISTROS', width - padding - 20, summaryY + 28)

    ctx.fillStyle = '#0F172A'
    ctx.font = '900 20px sans-serif'
    ctx.fillText(`${resumenHistorico.value.totalCobros} cobros`, width - padding - 20, summaryY + 58)
    ctx.textAlign = 'left'

    // Desglose por método en la parte inferior del resumen
    const metodosCount: Record<string, number> = {}
    cobrosFiltrados.value.forEach(c => {
      metodosCount[c.metodo_pago] = (metodosCount[c.metodo_pago] || 0) + Number(c.monto)
    })

    ctx.fillStyle = '#475569'
    ctx.font = '600 10px sans-serif'
    let textDesglose = 'Desglose: '
    Object.entries(metodosCount).forEach(([met, monto]) => {
      textDesglose += `${met}: S/ ${monto.toFixed(2)}   `
    })
    ctx.fillText(textDesglose.trim(), padding + 20, summaryY + 92)

    // 4. Cabecera de la Tabla de Registros
    const tableHeaderY = summaryY + summaryHeight + 5
    ctx.fillStyle = '#0F172A'
    ctx.fillRect(padding, tableHeaderY, summaryW, 26)

    ctx.fillStyle = '#FFFFFF'
    ctx.font = '800 10px sans-serif'
    ctx.fillText('FECHA / HORA', padding + 12, tableHeaderY + 17)
    ctx.fillText('PAGADO POR', padding + 150, tableHeaderY + 17)
    ctx.fillText('MÉTODO', padding + 360, tableHeaderY + 17)
    ctx.textAlign = 'right'
    ctx.fillText('MONTO', width - padding - 15, tableHeaderY + 17)
    ctx.textAlign = 'left'

    // 5. Filas de la Tabla de Registros
    let currentY = tableHeaderY + 26
    const items = cobrosFiltrados.value.slice(0, listLimit)

    items.forEach((cobro, index) => {
      ctx.fillStyle = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
      ctx.fillRect(padding, currentY, summaryW, itemHeight)

      ctx.strokeStyle = '#E2E8F0'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(padding, currentY + itemHeight)
      ctx.lineTo(width - padding, currentY + itemHeight)
      ctx.stroke()

      ctx.fillStyle = '#64748B'
      ctx.font = '500 10px sans-serif'
      ctx.fillText(formatFechaCompleta(cobro.created_at), padding + 12, currentY + 20)

      ctx.fillStyle = '#0F172A'
      ctx.font = '700 11px sans-serif'
      const nombreTrunc = cobro.pagado_por.length > 25 ? cobro.pagado_por.slice(0, 23) + '...' : cobro.pagado_por
      ctx.fillText(nombreTrunc, padding + 150, currentY + 20)

      ctx.fillStyle = '#334155'
      ctx.font = '600 10px sans-serif'
      ctx.fillText(cobro.metodo_pago, padding + 360, currentY + 20)

      ctx.textAlign = 'right'
      ctx.fillStyle = '#047857'
      ctx.font = '800 11px sans-serif'
      ctx.fillText(`S/ ${formatMonto(cobro.monto)}`, width - padding - 15, currentY + 20)
      ctx.textAlign = 'left'

      currentY += itemHeight
    })

    // 6. Pie de Página del Voucher
    const footerY = currentY + 15
    ctx.strokeStyle = '#CBD5E1'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, footerY)
    ctx.lineTo(width - padding, footerY)
    ctx.stroke()

    ctx.fillStyle = '#94A3B8'
    ctx.font = '600 9px sans-serif'
    ctx.fillText('Auditado en tiempo real · Transparencia Cancha Sintética', padding, footerY + 18)

    ctx.textAlign = 'right'
    ctx.fillText('Documento Oficial de Recaudación', width - padding, footerY + 18)

    // 7. Descargar la imagen PNG
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    const fechaSlug = format(new Date(), 'yyyy-MM-dd-HHmm')
    link.download = `comprobante-recaudacion-${fechaSlug}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    console.error('Error generando voucher:', err)
  } finally {
    generandoVoucher.value = false
  }
}

// ── Realtime y Polling de respaldo ──────────────────────────
function suscribirRealtime() {
  realtimeChannel = supabase
    .channel('cobros-realtime-landing')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'cobros' },
      (payload) => {
        console.log('⚡ Nuevo cobro en tiempo real:', payload.new)
        const nuevoCobro = payload.new as Cobro
        if (nuevoCobro) {
          const inicioMes = startOfMonth(new Date()).toISOString()
          if (nuevoCobro.created_at >= inicioMes && !cobros.value.some(c => c.id === nuevoCobro.id)) {
            cobros.value.unshift(nuevoCobro)
          }
          calcularStats(true)
          if (showHistorialModal.value) {
            consultarHistorial()
          }
        }
      }
    )
    .subscribe((status, err) => {
      console.log('📡 Estado suscripción Realtime:', status, err || '')
    })
}

function handleVisibilityOrFocusChange() {
  if (document.visibilityState === 'visible') {
    cargarCobros(true)
    calcularStats(true)
  }
}

// ── Lifecycle ───────────────────────────────────────────────
onMounted(async () => {
  const ahora = new Date()
  fechaInicio.value = format(startOfMonth(ahora), 'yyyy-MM-dd')
  fechaFin.value = format(endOfMonth(ahora), 'yyyy-MM-dd')

  await Promise.all([cargarCobros(), calcularStats()])
  suscribirRealtime()

  // Polling silencioso de respaldo cada 20 segundos
  pollTimer = setInterval(() => {
    cargarCobros(true)
    calcularStats(true)
  }, 20000)

  window.addEventListener('focus', handleVisibilityOrFocusChange)
})

onUnmounted(() => {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel)
  }
  if (pollTimer) {
    clearInterval(pollTimer)
  }
  window.removeEventListener('focus', handleVisibilityOrFocusChange)
})
</script>

<style scoped>
.cobro-enter-active {
  animation: slideInFeed 0.4s ease-out;
}

.cobro-move {
  transition: transform 0.3s ease;
}

@keyframes slideInFeed {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Transición Modal */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease-out;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Scrollbar personalizado delgado */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
