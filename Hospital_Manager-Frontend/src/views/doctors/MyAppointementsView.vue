<script setup>
import { onMounted, ref } from 'vue'
import { useLoginStore } from '@/stores/login'
import { usePatientsStore } from '@/stores/patient'
import { useAppointmentsStore } from '@/stores/Appointement'
import { useRoomStore } from '@/stores/room'
const appointmentsStore = useAppointmentsStore()
const roomStore = useRoomStore()

const loginStore = useLoginStore()
// const patients = usePatientsStore()
const doctor = loginStore.currentUser.data
// const doctorPatients = patients.patientsByDoctor(doctor)
// const appointments = appointmentsStore.appointments

const date = (id) => {
  const appoint = appointments.find((apt) => apt.id == id)
  const [date, heure] = appoint.date.split('T')
  return {
    date: date,
    heure: heure,
  }
}

async function statusChanger(patId, status) {
  const data = await fetch(`http://localhost:3000/patients/changestatus/${patId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: status,
  })
  if (!data.ok) throw new Error()
}

let myAppoints = ref([])
async function doctorAppoints() {
  const data = await fetch(`http://localhost:3000/api/appointments/docappointments/${doctor.id}`)
  const res = data.json()
  myAppoints.value = [...res]
}

// logique Style
const getStatusClass = (status) => {
  switch (status) {
    case 'En attente':
      return 'bg-amber-400 text-white py-1 rounded-full px-3 max-w-[100%]'
    case 'Consultation':
      return 'bg-blue-400 text-white py-1 rounded-full px-3 max-w-[100%]'
    case 'Sorti':
      return 'bg-emerald-400 text-white py-1 rounded-full px-3 max-w-[100%]'
    case 'Hospitalisation':
      return 'bg-red-500 text-red-100 py-1 rounded-full px-3 max-w-[100%]'
    default:
      return ''
  }
}
onMounted(doctorAppoints)
</script>

<template>
  <div class="mx-12 mt-8">
    <h1 class="text-3xl text-green-950 font-semibold tracking-tight">
      Programme des consultations
    </h1>

    <div class="bg-white border border-gray-200 rounded-xl mt-12 shadow-sm overflow-hidden">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr class="text-gray-500 uppercase text-xs tracking-wide">
            <th class="px-6 py-4 text-left">First Name</th>
            <th class="px-6 py-4 text-left">Last Name</th>
            <th class="px-6 py-4 text-left">Room</th>
            <th class="px-6 py-4 text-left">Date</th>
            <th class="px-6 py-4 text-left">Hours</th>
            <th class="px-6 py-4 text-left">Status</th>
            <th class="px-6 py-4 text-left">
              Actions
              <span class="text-red-400 normal-case font-medium"> (Editing of status) </span>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="patient in myAppoints"
            :key="patient.idAppoint"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-6 py-4 font-medium text-gray-800">
              {{ patient.patient.firstName }}
            </td>

            <td class="px-6 py-4 text-gray-700">
              {{ patient.patient.lastName }}
            </td>

            <td class="px-6 py-4 text-gray-700">
              {{
                roomStore.getRoomById(patient.patient.roomId)
                  ? roomStore.getRoomById(patient.patient.roomId).name
                  : 'Non assigné'
              }}
            </td>

            <td class="px-6 py-4 text-gray-600">
              {{ date(patient.idAppoint).date }}
            </td>

            <td class="px-6 py-4 text-gray-600">
              {{ date(patient.idAppoint).heure }}
            </td>

            <td class="px-6 py-4">
              <span :class="getStatusClass(patient.patient.status)" class="text-sm font-medium">
                {{ patient.patient.status }}
              </span>
            </td>

            <td class="px-6 py-4">
              <select
                class="border border-gray-300 px-3 py-1.5 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                v-model="patient.patient.status"
                @change="statusChanger(patient.patient.id, patient.patient.status)"
              >
                <option value="Consultation">Consultation</option>
                <option value="Hospitalisation">Hospitalisation</option>
                <option value="Sorti">Sorti</option>
              </select>
            </td>
          </tr>

          <tr v-if="appointmentsStore.allApointmentsByDoctor(doctorPatients).length == 0">
            <td colspan="7" class="py-16 text-center text-gray-400 italic">
              Aucun rendez-vous programmé.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
