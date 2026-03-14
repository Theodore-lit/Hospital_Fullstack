<script setup>
import { usePatientsStore } from '@/stores/patient'
import formPatient from '@/components/formPatient.vue'
import { usePatientManageStore } from '@/stores/patientManager'
import { useRoomStore } from '@/stores/room'
import { onMounted, ref, watch } from 'vue'
import { useAppointmentsStore } from '@/stores/Appointement'
import { useDoctorsStore } from '@/stores/doctor'
//sweetalerte
import Swal from 'sweetalert2'
import { apiFetch } from '@/services/api.js'
// const f = await apiFetch()
// console.log(f);

const showError = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
  })
}

const addAlerte = (message) => {
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 1500,
  })
}

const roomStore = useRoomStore()
const patientStore = usePatientsStore()
let allPatients = ref([])
const manageStore = usePatientManageStore()
const date = ref()
let patientId
let removeId
const doctorId = ref()
const doctors = ref()

let modalPlanning = ref(null)
async function planningModal(patient) {
  modalPlanning.value = true
  patientId = patient.id
  const data = await apiFetch('/doctors/available')
  doctors.value = [...data]
}

const nows = new Date()
nows.setMinutes(nows.getMinutes() - nows.getTimezoneOffset())
const formatted = nows.toISOString().slice(0, 16)

async function patients() {
  const data = await apiFetch('/patients/allPatients')  
  allPatients.value = [...data.patients]
  
}

async function submitPlanning() {
  const data = await apiFetch('/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patientId: patientId,
      doctorId: doctorId.value,
      date: date.value,
    }),
  })
  if (!data.ok) return showError("'Ce médecin est occuppé à cette date'")

  modalPlanning.value = false
  doctorId.value = ''
  date.value = ''
}

function removePlanningModal() {
  modalPlanning.value = false
}

let modalDelete = ref(null)
async function yesRemove() {
  const dataPatient = await apiFetch(`/patients/${removeId}`, {
    method: 'DELETE',
  })
  if (!dataPatient.ok) showError('Impossible de supprimer ce patient')
  await patients()
  modalDelete.value = false
  addAlerte("Rendez-vous pris")
}

const confirmDelete = (id) => {
  removeId = id
  modalDelete.value = true
}

// watch(
//   () => patientStore.newAdd,
//   (newadd) => {
//     if (newadd) {
//       console.log(newadd)
//       patients()
//       patientStore.notifNew(null)
//     }
//   },
// )

onMounted(patients)
</script>

<template>
  <Transition v-if="modalDelete">
    <div
      class="fixed inset-0 flex items-center justify-center h-full z-50 backdrop-blur confirm-dialog"
    >
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
              <p class="text-lg text-gray-700 mt-1">
                Êtes-vous sûr de vouloir supprimer ce patient ?
              </p>
            </div>
          </div>
          <div class="text-center md:text-right mt-4 md:flex md:justify-end">
            <button
              @click="yesRemove"
              id="confirm-delete-btn"
              class="block w-full cursor-pointer md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2"
            >
              Supprimer
            </button>
            <button
              @click="modalDelete = false"
              id="confirm-cancel-btn"
              class="block w-full cursor-pointer md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="modalPlanning" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        @click="removePlanningModal()"
      ></div>

      <!-- Modal -->
      <div
        class="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6"
        role="dialog"
        aria-modal="true"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-800">Planifier un rendez-vous</h2>

          <button
            @click="removePlanningModal()"
            class="text-gray-400 cursor-pointer hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="submitPlanning()" class="space-y-5">
          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1"> Date & heure </label>
            <input
              v-model="date"
              type="datetime-local"
              :min="formatted"
              required
              class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <!-- Doctor -->
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1"> Médecin </label>
            <select
              v-model="doctorId"
              required
              class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="" disabled>Sélectionner un médecin</option>
              <option v-for="doc in doctors" :key="doc.id" :value="doc.id">
                Dr. {{ doc.name }} — {{ doc.specialty }}
              </option>
            </select>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="removePlanningModal()"
              class="px-4 py-2 cursor-pointer rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            >
              Annuler
            </button>

            <button
              type="submit"
              class="px-5 py-2 cursor-pointer rounded-lg bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 active:scale-95 transition"
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
  <div class="space-y-8 m-12">
    <formPatient />

    <div
      class="flex flex-col md:flex-row gap-4 items-center bg-white/80 backdrop-blur-md p-2 pl-6 rounded-2xl shadow-sm border border-slate-200"
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
          v-model="manageStore.searchQuery"
          type="text"
          placeholder="Rechercher un dossier patient..."
          class="bg-transparent border-none focus:ring-0 w-full text-slate-700 placeholder-slate-400 py-3"
        />
      </div>

      <div class="flex items-center gap-2 pr-2 w-full md:w-auto">
        <select
          v-model="manageStore.statusFilter"
          class="bg-slate-50 border-none text-slate-600 text-sm font-semibold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
        >
          <option value="all">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="Consultation">Consultation</option>
          <option value="Hospitalisation">Hospitalisation</option>
          <option value="Sorti">Sorti</option>
        </select>
      </div>
    </div>

    <div class="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50">
            <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Patient & Date
            </th>
            <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Chambre
            </th>
            <th
              class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center"
            >
              Groupe
            </th>
            <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              État actuel
            </th>
            <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500"></th>
            <th
              class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 text-right"
            >
              Gestion
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="patient in allPatients"
            :key="patient.id"
            class="group hover:bg-blue-50/30 transition-all duration-200"
          >
            <td class="px-6 py-5">
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm"
                >
                  {{ patient.firstName[0] }}{{ patient.lastName[0] }}
                </div>
                <div>
                  <p class="font-bold text-slate-900 leading-tight">
                    {{ patient.firstName }} {{ patient.lastName }}
                  </p>
                  <p
                    class="text-[10px] text-blue-500 font-medium mt-0.5 uppercase tracking-tighter"
                  ></p>

                  <p
                    class="text-[10px] text-blue-500 font-medium mt-0.5 uppercase tracking-tighter"
                  >
                    Admis le : {{ patient.createdAt || 'Date inconnue' }}
                  </p>
                </div>
              </div>
            </td>

            <td class="px-6 py-5 text-start">
              <span
                v-if="patient.roomId"
                class="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold"
              >
                {{ roomStore.rooms.find((r) => r.id === patient.roomId)?.name || 'N/A' }}
              </span>
              <span v-else class="text-xs text-slate-300 italic">Non assignée</span>
            </td>

            <td class="px-6 py-5">
              <div class="flex justify-center">
                <span
                  class="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-black border border-red-100"
                >
                  {{ patient.bloodGroup }}
                </span>
              </div>
            </td>

            <td class="px-6 py-5">
              <span
                :class="{
                  'bg-amber-50 text-amber-700 border-amber-100': patient.status === 'En attente',
                  'bg-blue-50 text-blue-700 border-blue-100': patient.status === 'Consultation',
                  'bg-emerald-50 text-emerald-700 border-emerald-100': patient.status === 'Sorti',
                  'bg-red-50 text-red-700 border-red-100': patient.status === 'Hospitalisation',
                }"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
              >
                <span
                  :class="{
                    'bg-amber-400': patient.status === 'En attente',
                    'bg-blue-400': patient.status === 'Consultation',
                    'bg-emerald-400': patient.status === 'Sorti',
                    'bg-red-400': patient.status === 'Hospitalisation',
                  }"
                  class="h-1.5 w-1.5 rounded-full animate-pulse"
                ></span>
                {{ patient.status }}
              </span>
            </td>

            <td class="px-6 py-5 text-center">
              <button
                v-if="patient.status == 'En attente' || patient.status == 'Sorti'"
                @click="planningModal(patient)"
                class="inline-flex cursor-pointer items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-200/50 transition-all duration-200 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>

                Planifier un RDV
              </button>
            </td>

            <td class="px-6 py-5 text-right">
              <div
                class="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <RouterLink
                  :to="{ name: 'details', query: { id: patient.id } }"
                  class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Voir les détails"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </RouterLink>

                <button
                  @click="manageStore.setEditPatient(patient)"
                  class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                  title="Modifier"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                <button
                  @click="confirmDelete(patient.id)"
                  class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Supprimer"
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
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="allPatients.length === 0" class="py-20 text-center">
        <p class="text-slate-400 font-medium">Aucun patient ne correspond à votre recherche.</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
