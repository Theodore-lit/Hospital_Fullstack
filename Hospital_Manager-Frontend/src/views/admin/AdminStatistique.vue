<script setup>
import { computed, onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import { usePatientsStore } from '@/stores/patient'
import { useDoctorsStore } from '@/stores/doctor'
import { useReceptionnistsStore } from '@/stores/receptionnist'
import { useAppointmentsStore } from '@/stores/Appointement'
import { useRoomStore } from '@/stores/room'
import { Line } from 'vue-chartjs'
const appointmentStore = useAppointmentsStore()
const patientsStore = usePatientsStore()
const doctorsStore = useDoctorsStore()
const receptionnistsStore = useReceptionnistsStore()
const roomStore = useRoomStore()
const pieCanvas = ref(null)
const lineCanvas = ref(null)

// const lundi = computed(()=>{
//   return appointmentStore.appointmentsDayString("lundi")
// })
// const mardi = computed(()=>{
//   return appointmentStore.appointmentsDayString("mardi")
// })
// const mercredi = computed(()=>{
//   return appointmentStore.appointmentsDayString("mercredi")
// })
// const jeudi = computed(()=>{
//   return appointmentStore.appointmentsDayString("jeudi")
// })
// const vendredi = computed(()=>{
//   return appointmentStore.appointmentsDayString("vendredi")
// })
// const samedi = computed(()=>{
//   return appointmentStore.appointmentsDayString("samedi")
// })
// const dimanche = computed(()=>{
//   return appointmentStore.appointmentsDayString("dimanche")
// })

const weekData = computed(() => {
  return [
    appointmentStore.appointmentsThisWeek('lundi').length,
    appointmentStore.appointmentsThisWeek('mardi').length,
    appointmentStore.appointmentsThisWeek('mercredi').length,
    appointmentStore.appointmentsThisWeek('jeudi').length,
    appointmentStore.appointmentsThisWeek('vendredi').length,
    appointmentStore.appointmentsThisWeek('samedi').length,
    appointmentStore.appointmentsThisWeek('dimanche').length,
  ]
})

onMounted(() => {
  // =====================
  // 📊 PIE CHART PERSONNEL
  // =====================
  new Chart(pieCanvas.value, {
    type: 'pie',
    data: {
      labels: ['Doctor', 'Receptionnites', 'Patients'],
      datasets: [
        {
          label: 'Personnel',
          data: [
            doctorsStore.doctors.length,
            receptionnistsStore.receptionnists.length,
            patientsStore.patients.length,
          ],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
        },
      ],
    },
  })

  // =====================
  // 📈 LINE CHART RDV
  // =====================
  new Chart(lineCanvas.value, {
    type: 'line',
    data: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [
        {
          label: 'Nombre de RDV',
          data: weekData.value,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59,130,246,0.2)',
          tension: 0.5,
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 2,
            precision: 1,
          },
        },
      },
    },
  })
})
</script>

<template>
  <main class="min-h-screen bg-slate-50 p-6 md:p-10">
    <header class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Tableau de Bord Hospitalier</h1>
        <p class="text-sm text-slate-500">Bienvenue, voici l'état actuel de votre établissement.</p>
      </div>
    </header>

    <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <RouterLink :to="{ name: 'patients-admin' }">
        <div
          class="group relative overflow-hidden rounded-2xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur-md transition-all hover:shadow-md"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Patients Totaux
              </p>
              <h3 class="mt-1 text-2xl font-bold text-slate-800">
                {{ patientsStore.patients.length }}
              </h3>
            </div>
            <div class="rounded-lg bg-blue-50 p-3 text-blue-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-xs font-medium text-emerald-600">
            <span>Gérer les patients</span>
          </div>
        </div>
      </RouterLink>

      <RouterLink>
        <div
          class="group relative overflow-hidden rounded-2xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur-md transition-all hover:shadow-md"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Rendez-vous
              </p>
              <h3 class="mt-1 text-2xl font-bold text-slate-800">
                {{ appointmentStore.appointmentsDayNumbers }}
              </h3>
            </div>
            <div class="rounded-lg bg-blue-50 p-3 text-blue-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <p class="mt-4 text-xs text-slate-400 font-medium">Aujourd'hui</p>
        </div>
      </RouterLink>

      <RouterLink :to="{ name: 'doctors-admin' }">
        <div
          class="group relative overflow-hidden rounded-2xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur-md transition-all hover:shadow-md"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Docteurs Actifs
              </p>
              <h3 class="mt-1 text-2xl font-bold text-slate-800">
                {{ doctorsStore.doctorsInWork }}
              </h3>
            </div>
            <div class="rounded-lg bg-blue-600 p-3 text-white">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          <p class="mt-4 text-xs text-slate-400 font-medium">Gérer les Docteurs</p>
        </div>
      </RouterLink>

      <RouterLink :to="{ name: 'rooms-admin' }">
        <div
          class="group relative overflow-hidden rounded-2xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur-md transition-all hover:shadow-md"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Chambres</p>
              <h3 class="mt-1 text-2xl font-bold text-slate-800">{{ roomStore.rooms.length }}</h3>
            </div>
            <div class="rounded-lg bg-red-50 p-3 text-red-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
          <p class="mt-4 text-xs text-black-500 font-bold">Gérer les chambres</p>
        </div>
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div
        class="lg:col-span-2 rounded-2xl max-h-85 border border-white bg-white/80 p-6 shadow-sm backdrop-blur-md"
      >
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-800">Données graphiques</h2>
        </div>
        <div
          class="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white/0"></div>

          <div class="relative h-full w-full">
            <canvas ref="lineCanvas"></canvas>
          </div>
        </div>
      </div>

      <div
        class="rounded-3xl border max-h-80 border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Répartition Flux
          </h2>
          <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
            >Live Update</span
          >
        </div>
        <div class="relative flex h-60 items-center justify-center">
          <canvas ref="pieCanvas" class=""></canvas>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
