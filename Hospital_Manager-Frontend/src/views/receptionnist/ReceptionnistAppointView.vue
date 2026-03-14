<script setup>
import { apiFetch } from '@/services/api.js'
import { useAppointmentsStore } from '@/stores/Appointement'
import { useDoctorsStore } from '@/stores/doctor'
import { usePatientsStore } from '@/stores/patient'
import { useRoomStore } from '@/stores/room'
import { onMounted, ref } from 'vue'
const roomStore = useRoomStore()
const doctorsStore = useDoctorsStore()
const patientsStore = usePatientsStore()
const patients = patientsStore.patients
const doctors = doctorsStore.doctors
const appointmentsStore = useAppointmentsStore()
// const appointments = appointmentsStore.allAppointment(patients, doctors);

let appointments = ref([])
async function allAppointments() {
const data = await apiFetch('/appointments/all')
  // const data = await fetch('http://localhost:3000/api/appointments/all', {
  //   credentials: "include",
  // })
  // const res = await data.json()
  appointments.value = [...data]
}

const date = (dt) => {
  const [date, heure] = dt.split('T')
  return {
    date: date,
    heure: heure,
  }
}

let modalDelete = ref(null)
let removeId
function yesRemove() {
  appointmentsStore.deleteAppointments(removeId)

  modalDelete.value = false
}
const confirmDelete = (id) => {
  removeId = id
  modalDelete.value = true
}

onMounted(allAppointments)
</script>

<template>
  <Transition v-if="modalDelete">
    <div class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur confirm-dialog">
      <div class="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
        <div class="opacity-25 w-full h-full absolute z-10 inset-0"></div>
        <div
          class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative shadow-lg"
        >
          <div class="md:flex items-center">
            <div
              class="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto"
            >
              <i class="bx bx-error text-3xl"> &#9888; </i>
            </div>
            <div class="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <p class="font-bold">Warning!</p>
              <p class="text-sm text-gray-700 mt-1">
                Êtes-vous sûr de vouloir supprimer ce patient ? Cette action libérera également son
                lit.
              </p>
            </div>
          </div>
          <div class="text-center md:text-right mt-4 md:flex md:justify-end">
            <button
              @click="yesRemove()"
              id="confirm-delete-btn"
              class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2"
            >
              Delete
            </button>
            <button
              @click="modalDelete = false"
              id="confirm-cancel-btn"
              class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- <div class="antialiased font-sans min-h-screen w-full"> -->
  <div class="min-h-screen px-10 py-8">
    <h1 class="text-3xl text-green-950 font-semibold">Régistre des consultations</h1>
    <div
      class="flex flex-col my-12 md:flex-row gap-4 items-center bg-white/80 z-1 backdrop-blur-md p-2 pl-6 rounded-lg shadow-sm border border-slate-200"
    >
      <div class="flex items-center flex-1 w-full gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="appointmentsStore.searchQuery"
          type="text"
          placeholder="Rechercher un rendez-vous patient..."
          class="bg-transparent border-none focus:ring-0 w-full text-slate-700 placeholder-slate-400 py-3"
        />
      </div>
      <div class="flex items-center gap-2 pr-2 w-full md:w-auto">
        <select
          v-model="appointmentsStore.doctorFilter"
          class="bg-slate-50 border-none text-slate-600 text-sm font-semibold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
        >
          <option value="all">All</option>
          <option v-for="doc in doctors" :key="doc.id" :value="doc.id">
            Dr. {{ doc.name }} - {{ doc.specialty }}
          </option>
        </select>
      </div>
    </div>
    <div
      class="bg-white border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden mt-6"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/60">
              <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Patient
              </th>
              <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Médecin
              </th>
              <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">
                État
              </th>
              <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Date
              </th>
              <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Heure
              </th>

              <th class="px-6 py-5"></th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="apt in appointments"
              :key="apt.id"
              class="group hover:bg-blue-50/30 transition-all duration-200"
            >
              <!-- Patient -->
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm"
                  >
                    {{ apt.patient.firstName[0] }}{{ apt.patient.lastName[0] }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 leading-tight">
                      {{ apt.patient.firstName }} {{ apt.patient.lastName }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Médecin -->
              <td class="px-6 py-5 text-slate-700 font-medium">Dr {{ apt.doctor }}</td>

              <!-- Status -->
              <!-- <td class="px-6 py-5">
                <span
                  :class="{
                    'bg-amber-50 text-amber-700 border-amber-100':
                      apt.patient.status === 'En attente',
                    'bg-blue-50 text-blue-700 border-blue-100':
                      apt.patient.status === 'Consultation',
                    'bg-emerald-50 text-emerald-700 border-emerald-100':
                      apt.patient.status === 'Sorti',
                    'bg-red-50 text-red-700 border-red-100':
                      apt.patient.status === 'Hospitalisation',
                  }"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                >
                  <span
                    :class="{
                      'bg-amber-400': apt.patient.status === 'En attente',
                      'bg-blue-400': apt.patient.status === 'Consultation',
                      'bg-emerald-400': apt.patient.status === 'Sorti',
                      'bg-red-400': apt.patient.status === 'Hospitalisation',
                    }"
                    class="h-1.5 w-1.5 rounded-full"
                  ></span>
                  {{ apt.patient.status }}
                </span>
              </td> -->

              <!-- Status du rendez-vous -->
              <td class="px-6 py-5 text-slate-600">
                <span
                  :class="{
                    'bg-amber-50 text-amber-700 border-amber-100': apt.mode === 'En cours',
                    'bg-emerald-50 text-emerald-700 border-emerald-100': apt.mode === 'Attente',
                    'bg-red-50 text-red-700 border-red-100': apt.mode === 'Passé',
                  }"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                >
                  <span
                    :class="{
                      'bg-amber-400': apt.mode === 'En cours',
                      'bg-emerald-400': apt.mode === 'Attente',
                      'bg-red-400': apt.mode === 'Passé',
                    }"
                    class="h-1.5 w-1.5 rounded-full"
                  ></span>
                  {{ apt.mode }}
                </span>
              </td>

              <!-- Date -->
              <td class="px-6 py-5 text-slate-600">
                {{ date(apt.dateAppoint).date }}
              </td>

              <!-- Heure -->
              <td class="px-6 py-5 text-slate-600">
                {{ date(apt.dateAppoint).heure }}
              </td>

              <!-- Action -->
              <td class="px-6 py-5 text-right">
                <button
                  @click="confirmDelete(apt.idAppoint)"
                  class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Archiver"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="appointments.length === 0" class="py-20 text-center">
        <p class="text-slate-400 font-medium">Aucun rendez-vous trouvé.</p>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<style scoped></style>
