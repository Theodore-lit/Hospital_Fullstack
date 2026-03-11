<script setup>
import { useLoginStore } from '@/stores/login'
import { useReceptionnistsStore } from '@/stores/receptionnist'
import { reactive, watch } from 'vue'

const loginStore = useLoginStore()
const receptionnistStore = useReceptionnistsStore()
const receptionnist = reactive({
  name: '',
  email: '',
  age: '',
  phone: '',
  experience: '',
  city: '',
  bio: '',
})

watch(
  () => receptionnistStore.editedReceptionnists,
  (newVal) => {
    Object.assign(receptionnist, newVal)
  },
)

function submitReceptionnist() {
  const obj = {
    id: Date.now(),
    name: receptionnist.name,
    email: receptionnist.email,
    age: receptionnist.age,
    password: '1234',
    phone: receptionnist.phone,
    role: 'receptionnist',
    experience: receptionnist.experience,
    city: receptionnist.city,
    specialty: 'Acceuil général',
    bio: receptionnist.bio,
    status: 'disponible',
  }
  if (receptionnistStore.isEdit) {
    receptionnistStore.updatedReceptionnist(obj)
  } else {
    receptionnistStore.addReceptionnist(obj)
    loginStore().addUser(obj)
  }

  // Reset formulaire

  Object.keys(receptionnist).forEach((key) => (receptionnist[key] = ''))
}

function CloseModalForm() {
  receptionnistStore.closeForm()
}
</script>

<template>
  <div
    v-if="receptionnistStore.isFormOpen"
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
          Ajouter un receptionniste
        </h1>
      </div>

      <div class="p-8">
        <form @submit.prevent="submitReceptionnist">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Nom complet *</label>
              <input
                type="text"
                v-model="receptionnist.name"
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
                v-model="receptionnist.email"
                class="block w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 text-sm shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                placeholder="sarah.martin@clinique.fr"
                required
              />
            </div>
          </div>

          <div class="my-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Age *</label>
              <input
                type="number"
                placeholder="votre age"
                v-model="receptionnist.age"
                class="block w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Téléphone *</label>
              <input
                type="text"
                v-model="receptionnist.phone"
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
                v-model="receptionnist.experience"
                class="block w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 text-sm shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                placeholder="Nombre d'années"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Résidence</label>
              <input
                type="text"
                v-model="receptionnist.city"
                class="block w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 text-sm shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                placeholder="Ex: Akassato"
              />
            </div>
          </div>

          <div class="mb-8">
            <label class="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              v-model="receptionnist.bio"
              rows="3"
              class="w-full resize-none rounded-lg border border-slate-300 bg-white/50 p-4 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
              placeholder="Décrivez le parcours ou les compétences spécifiques du docteur..."
            ></textarea>
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
              {{ receptionnistStore.isEdit ? 'Modifier' : 'Créer le profil' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
