<script setup>
import { onMounted, ref, watch } from 'vue'
import { usePatientsStore } from '@/stores/patient'
import { usePatientManageStore } from '@/stores/patientManager'
import { useRoomStore } from '@/stores/room'
import { useDoctorsStore } from '@/stores/doctor'
import { useAppointmentsStore } from '@/stores/Appointement'
//sweetalerte
import Swal from 'sweetalert2'
import { apiFetch } from '@/services/api'
const showError = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
  })
}

const addAlerte = () => {
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Your patient has been saved',
    showConfirmButton: false,
    timer: 1500,
  })
}
let doctors = ref([])
async function availableDoctors() {
  const data = await apiFetch('/doctors/available')
  // const res = await data.json()  
  doctors.value = [...data]
}
let rooms = ref([])
async function availableRooms() {
  const data = await apiFetch('/rooms/available')
  // const res = await data.json()
  rooms.value = [...data]
}

const doctorsStore = useDoctorsStore()
const patientsStore = usePatientsStore()
const manageStore = usePatientManageStore()
const modalAdd = ref(false)
let date = ref()
const now = new Date()
now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
const formatted = now.toISOString().slice(0, 16)

const form = ref({
  firstName: '',
  lastName: '',
  gender: 'M',
  phone: '',
  bloodGroup: 'A+',
  status: 'En attente',
  roomId: null,
  doctorId: '--Aucun Médecin--',
  aptDate: null,
})

watch(
  () => manageStore.selectedPatientForEdit,
  (newVal) => {
    if (newVal) form.value = { ...newVal }
    else resetForm()
  },
  { deep: true },
)

const resetForm = () => {
  form.value = {
    firstName: '',
    lastName: '',
    gender: 'M',
    phone: '',
    bloodGroup: 'A+',
    status: 'En attente',
    doctorId: '--Aucun Médecin--',
  }
}

async function handleSubmit() {
  if (form.value.status == 'En attente') {
    form.value.doctorId = null
    date.value = null
    form.value.roomId = null
  }
  if (form.value.status == 'Hospitalisation') {
    date.value = null
  }
  if (form.value.status == 'Consultation') {
    form.value.roomId = null
  }
  if (manageStore.selectedPatientForEdit) {
    const data = await apiFetch(
      `/patients/${manageStore.selectedPatientForEdit.id}`,
      {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.value),
      },
    )
    manageStore.clearEdit()
  } else {
    const data = await apiFetch('/patients', {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    })
    
    if (data.status == 404) return showError('Le médecin est occuppé à cette date')
    if (!data.ok) return showError('Vérifer tous les champs avant soumission')
    addAlerte()
    patientsStore.notifNew(true)
  }
  resetForm()
}

onMounted(availableDoctors)
onMounted(availableRooms)
</script>

<template>
  <div v-if="modalAdd == true" class="fixed z-10 inset-0 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div> -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
      <div
        class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
      >
        <div class="sm:flex sm:items-start">
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <svg
              class="h-6 w-6 text-green-600"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Patient ajouté !</h3>
            <div class="mt-2">
              <p class="text-sm leading-5 text-gray-500">
                Un rendez-vous peut être plannifier maintenant. Vous venez d'ajouter un nouveau
                patient à votre liste de patients. <br />
              </p>
            </div>
          </div>
        </div>
        <!-- <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                    <button type="button"
                        class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                        Accept
                    </button>
                </span>
                <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                    <button type="button"
                        class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                        Cancel
                    </button>
                </span>
            </div> -->
      </div>
    </div>
  </div>

  <div class="bg-slate-50/50 p-1 border border-slate-200 mb-10 shadow-sm">
    <div class="bg-white p-8 border border-white shadow-sm">
      <div class="flex items-center justify-between mb-10">
        <div>
          <h2 class="text-2xl font-extrabold tracking-tight text-slate-900">
            {{ manageStore.selectedPatientForEdit ? 'Édition Dossier' : 'Nouveau Patient' }}
          </h2>
          <p class="text-slate-500 text-sm mt-1">Gestion administrative des admissions.</p>
        </div>
        <div class="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
          <!-- <span class="text-blue-600 text-xl"></span> -->

          <svg
            class="w-7 h-7 fill-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            <path
              d="M285.7 368C384.2 368 464 447.8 464 546.3C464 562.7 450.7 576 434.3 576L77.7 576C61.3 576 48 562.7 48 546.3C48 447.8 127.8 368 226.3 368L285.7 368zM528 144C541.3 144 552 154.7 552 168L552 216L600 216C613.3 216 624 226.7 624 240C624 253.3 613.3 264 600 264L552 264L552 312C552 325.3 541.3 336 528 336C514.7 336 504 325.3 504 312L504 264L456 264C442.7 264 432 253.3 432 240C432 226.7 442.7 216 456 216L504 216L504 168C504 154.7 514.7 144 528 144zM256 312C189.7 312 136 258.3 136 192C136 125.7 189.7 72 256 72C322.3 72 376 125.7 376 192C376 258.3 322.3 312 256 312z"
            />
          </svg>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
          <div class="relative group">
            <input
              v-model="form.firstName"
              type="text"
              id="fname"
              placeholder=" "
              class="peer w-full bg-transparent border-b-2 border-slate-200 py-2 outline-none focus:border-blue-400 transition-colors placeholder-transparent"
              required
            />
            <label
              for="fname"
              class="absolute left-0 -top-3.5 text-slate-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-xs"
              >Prénom</label
            >
          </div>

          <div class="relative group">
            <input
              v-model="form.lastName"
              type="text"
              id="lname"
              placeholder=" "
              class="peer w-full bg-transparent border-b-2 border-slate-200 py-2 outline-none focus:border-blue-400 transition-colors placeholder-transparent"
              required
            />
            <label
              for="lname"
              class="absolute left-0 -top-3.5 text-slate-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-xs"
              >Nom de famille</label
            >
          </div>

          <div class="relative group">
            <select
              v-model="form.gender"
              class="w-full bg-transparent border-b-2 border-slate-200 py-2 outline-none focus:border-blue-400 appearance-none cursor-pointer"
            >
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
            <label class="absolute left-0 -top-3.5 text-blue-500 text-xs">Genre</label>
          </div>

          <div class="relative group">
            <input
              v-model="form.phone"
              type="tel"
              id="tel"
              placeholder=" "
              class="peer w-full bg-transparent border-b-2 border-slate-200 py-2 outline-none focus:border-blue-500 transition-colors placeholder-transparent"
            />
            <label
              for="tel"
              class="absolute left-0 -top-3.5 text-slate-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-xs"
              >Téléphone</label
            >
          </div>

          <div class="relative group">
            <select
              v-model="form.bloodGroup"
              class="w-full bg-transparent border-b-2 border-slate-200 py-2 outline-none focus:border-blue-500 appearance-none"
            >
              <option v-for="g in ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']" :key="g">
                {{ g }}
              </option>
            </select>
            <label class="absolute left-0 -top-3.5 text-blue-500 text-xs">Groupe Sanguin</label>
          </div>

          <div class="relative group">
            <select
              v-model="form.status"
              class="w-full bg-transparent border-b-2 border-slate-200 py-2 outline-none focus:border-blue-400 appearance-none font-medium text-blue-700"
            >
              <option value="En attente">En attente</option>
              <option value="Consultation">Consultation</option>
              <option value="Hospitalisation">Hospitalisation</option>
            </select>
            <label class="absolute left-0 -top-3.5 text-blue-500 text-xs">Statut Actuel</label>
          </div>

          <div class="relative group" v-if="form.status == 'Hospitalisation'">
            <select
              v-model="form.roomId"
              class="w-full bg-transparent border-b-2 border-slate-200 py-2 outline-none focus:border-blue-400 appearance-none cursor-pointer"
            >
              <option value="">-- Sans chambre --</option>
              <option v-for="room in rooms" :key="room.id" :value="room.id">
                {{ room.name }} ({{ 4 - room.occupiedBy.length }} places libres)
              </option>
            </select>
            <label class="absolute left-0 -top-3.5 text-blue-500 text-xs">Chambre assignée</label>
          </div>

          <div
            class="relative group"
            v-if="form.status == 'Hospitalisation' || form.status == 'Consultation'"
          >
            <label class="absolute left-0 -top-3.5 text-blue-500 text-xs">Docteur assignée</label>
            <select
              v-model="form.doctorId"
              class="w-full bg-transparent border-b-2 border-slate-200 py-2 outline-none focus:border-blue-400 appearance-none font-medium text-blue-600"
            >
              <option v-for="doc in doctors" :key="doc.id" :value="doc.id">
                Dr. {{ doc.name }} - {{ doc.specialty }}
              </option>
            </select>
          </div>

          <div class="relative group" v-if="form.status == 'Consultation'">
            <input
              v-model="form.aptDate"
              :min="formatted"
              type="datetime-local"
              name="expiry-date"
              placeholder="MM/YY"
              class="w-full bg-transparent border-b-2 border-slate-200 py-2 outline-none focus:border-blue-400 appearance-none font-medium text-blue-600"
              required
              maxlength="5"
            />
            <label class="absolute left-0 -top-3.5 text-blue-500 text-xs"
              >Appointment's Date & Hours</label
            >
          </div>
        </div>
        <div class="flex items-center justify-between pt-4">
          <div class="flex items-center text-slate-400 text-xs italic">
            <span class="mr-2">●</span> Tous les champs sont obligatoires
          </div>

          <div class="flex gap-4">
            <button
              v-if="manageStore.selectedPatientForEdit"
              @click="manageStore.clearEdit()"
              type="button"
              class="px-5 py-2.5 rounded-xl cursor-pointer border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-medium"
            >
              Annuler
            </button>

            <button
              type="submit"
              class="px-8 py-2.5 rounded-xl cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-slate-200 font-semibold tracking-wide"
            >
              {{ manageStore.selectedPatientForEdit ? 'Mettre à jour' : 'Ajouter' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
