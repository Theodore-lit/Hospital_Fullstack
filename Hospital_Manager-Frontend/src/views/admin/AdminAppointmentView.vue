<script setup>
import { useAppointmentsStore } from '@/stores/Appointement'
import { useDoctorsStore } from '@/stores/doctor'
import { usePatientsStore } from '@/stores/patient'
import { useRoomStore } from '@/stores/room'
import { ref } from 'vue'
const roomStore = useRoomStore()
const doctorsStore = useDoctorsStore()
const patientsStore = usePatientsStore()
const patients = patientsStore.patients
const doctors = doctorsStore.doctors
const appointmentsStore = useAppointmentsStore()
const appointments = appointmentsStore.allAppointment(patients, doctors)

const date = (id) => {
  const appoint = appointmentsStore.appointments.find((apt) => apt.id == id)
  if (appoint) {
    const [date, heure] = appoint.date.split('T')
    return `le ${date} à ${heure}`
  }
}

console.log(appointments)

let modalDelete = ref(null)
let removeId
function yesRemove() {
  console.log('f')
  appointmentsStore.deleteAppointments(removeId)
  console.log(appointmentsStore.appointments)

  modalDelete.value = false
}
const confirmDelete = (id) => {
  removeId = id
  modalDelete.value = true
}

const getStatusClass = (status) => {
  switch (status) {
    case 'En attente':
      return 'bg-amber-400 text-white py-1 rounded-full px-3 max-w-[50%]'
    case 'Consultation':
      return 'bg-blue-400 text-white py-1 rounded-full px-3 max-w-[50%]'
    case 'Sorti':
      return 'bg-emerald-400 text-white py-1 rounded-full px-3 max-w-[50%]'
    default:
      return ''
  }
}
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

  <div class="antialiased font-sans h-screen bg-slate-200">
    <div class="container mx-auto px-4 sm:px-8">
      <div class="py-8">
        <div>
          <h2 class="text-2xl font-semibold leading-tight">Appointments</h2>
        </div>
        <div class="my-2 flex sm:flex-row flex-col">
          <div class="flex flex-row mb-1 sm:mb-0">
            <div class="relative">
              <select
                class="appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
              >
                <option>All</option>
                <option>En attente</option>
                <option>Consultation</option>
                <option>Sorti</option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              >
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="block relative">
            <span class="h-full absolute inset-y-0 left-0 flex items-center pl-2">
              <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current text-gray-500">
                <path
                  d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
                ></path>
              </svg>
            </span>
            <input
              placeholder="Search"
              class="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
            />
          </div>
        </div>
        <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table class="min-w-full leading-normal">
              <thead>
                <tr>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Patients
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Médecin
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Date & Hours
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Room
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    État actuel
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  ></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="apt in appointmentsStore.allAppointment(patients, doctors)"
                  :key="apt.id"
                >
                  <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div class="flex items-center">
                      <div
                        class="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm"
                      >
                        {{ apt.patient.firstName[0] }}{{ apt.patient.lastName[0] }}
                      </div>
                      <div class="ml-3">
                        <p class="text-gray-900 whitespace-no-wrap">
                          {{ apt.patient.firstName }} {{ apt.patient.lastName }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p class="text-gray-900 whitespace-no-wrap">Dr {{ apt.doctors.name }}</p>
                  </td>
                  <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p class="text-gray-900 whitespace-no-wrap">{{ date(apt.idAppoint) }}</p>
                  </td>

                  <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span
                      class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                    >
                      <span
                        aria-hidden
                        class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                      ></span>
                      <span class="relative">{{
                        roomStore.getRoomById(apt.patient.roomId).name
                      }}</span>
                    </span>
                  </td>
                  <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p :class="getStatusClass(apt.patient.status)">
                      {{ apt.patient.status }}
                    </p>
                  </td>

                  <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button
                      @click="confirmDelete(apt.idAppoint)"
                      class="p-2 cursor-pointer text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Archive appointment"
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
            <!-- <div
              class="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between"
            >
              <span class="text-xs xs:text-sm text-gray-900"> Showing 1 to 4 of 50 Entries </span>
              <div class="inline-flex mt-2 xs:mt-0">
                <button
                  class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
                >
                  Prev
                </button>
                <button
                  class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
                >
                  Next
                </button>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
