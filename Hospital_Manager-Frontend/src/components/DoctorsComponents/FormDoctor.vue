<script setup>
import { useDoctorsStore } from '@/stores/doctor'
import { useLoginStore } from '@/stores/login'
import { reactive, watch } from 'vue'
const doctorStore = useDoctorsStore()
const loginStore = useLoginStore()
import { ref } from 'vue'

const image = ref(null)
const preview = ref(null)

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  image.value = file

  // Prévisualisation
  const reader = new FileReader()
  reader.onload = (e) => {
    preview.value = e.target.result
  }
  reader.readAsDataURL(file)
}
const doctor = reactive({
  name: '',
  email: '',
  specialty: '',
  phone: '',
  experience: '',
  city: '',
  bio: '',
})

watch(
  () => doctorStore.editedDoctor,
  (newVal) => {
    Object.assign(doctor, newVal)
  },
)

function submitDoctor() {
  const obj = {
    id: Date.now(),
    password: '1234',
    role: 'doctor',
    status: 'disponible',
    name: doctor.name,
    email: doctor.email,
    specialty: doctor.specialty,
    phone: doctor.phone,
    experience: doctor.experience,
    city: doctor.city,
    bio: doctor.bio,
  }

  if (doctorStore.isEdit) {
    doctorStore.updatedDoctor(obj)
  } else {
    doctorStore.addDoctor(obj)
    loginStore.addUser(obj)
  }
  doctorStore.closeForm()
  // Reset formulaire

  Object.keys(doctor).forEach((key) => (doctor[key] = ''))
}

function CloseModalForm() {
  doctorStore.closeForm()
}
</script>

<template>
  <div
    v-if="doctorStore.isFormOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
    @click.self="CloseModalForm"
  >
    <div
      class="w-full max-w-2xl transform overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-md transition-all"
    >
      <div class="bg-blue-600 px-8 py-6 shadow-inner">
        <h1 class="flex items-center gap-3 text-2xl font-bold text-white">
          <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          Ajouter un nouveau docteur
        </h1>
      </div>

      <div class="p-8">
        <form @submit.prevent="submitDoctor">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Nom complet *</label>
              <input
                type="text"
                v-model="doctor.name"
                class="block w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 text-sm shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                placeholder="Ex: Dr. Sarah Martin"
                required
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Adresse Email Professionnelle *</label
              >
              <input
                type="email"
                v-model="doctor.email"
                class="block w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 text-sm shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                placeholder="sarah.martin@clinique.fr"
                required
              />
            </div>
          </div>

          <div class="my-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Spécialité *</label>
              <select
                v-model="doctor.specialty"
                class="block w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
              >
                <option value="">Sélectionner une spécialité</option>
                <option value="Médecine Générale">Médecine Générale</option>
                <option value="Cardiologie">Cardiologie</option>
                <option value="Pédiatrie">Pédiatrie</option>
                <option value="Dentiste">Dentiste</option>
                <option value="Autre">Autre...</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Téléphone *</label>
              <input
                type="text"
                v-model="doctor.phone"
                class="block w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 text-sm shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                placeholder="Ex: 10101234567"
              />
            </div>
          </div>

          <div class="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Années d'expérience</label
              >
              <input
                type="number"
                v-model="doctor.experience"
                class="block w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 text-sm shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                placeholder="Nombre d'années"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Résidence</label>
              <input
                type="text"
                v-model="doctor.city"
                class="block w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 text-sm shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                placeholder="Ex: Akassato"
              />
            </div>
          </div>

          <div class="mb-8">
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div class="flex justify-center gap-4">
            <button
              @click="CloseModalForm"
              type="button"
              class="min-w-[140px] rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="min-w-[140px] rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
            >
              {{ doctorStore.isEdit ? 'Modifier' : 'Créer le profil' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
