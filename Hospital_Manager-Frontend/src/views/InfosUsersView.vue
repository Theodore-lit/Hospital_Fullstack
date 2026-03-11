<script setup>
import { useLoginStore } from '@/stores/login'
import { useRouter } from 'vue-router'
import { watchEffect } from 'vue'
import PageUnauthoriziedView from './PageUnauthoriziedView.vue'
import Swal from 'sweetalert2'

const loginStore = useLoginStore()
const router = useRouter()

watchEffect(() => {
  if (!loginStore.isAuthentificated || !loginStore.currentUser) {
    router.replace({ name: 'login' })
  }
})

async function logout() {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You will be logged out.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel',
  })
  if (result.isConfirmed) {
    await loginStore.logout()
    router.replace({ name: 'login' })
  }
}

function goHome() {
  const role = loginStore.currentUser?.role
  console.log('ok')
  if (role == 'admin') {
    router.push({ name: 'dashboard-admin' })
  }
  if (role == 'doctor') {
    router.push({ name: 'dashboard-doctor' })
  }
  if (role == 'receptionnist') {
    router.push({ name: 'dashboard-receptionnist' })
  }
}
</script>

<template>
  <div class="bg-gray-50 p-20">
    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-6 z-10">
      <!-- Profile Card -->
      <div class="bg-white rounded-xl hover:shadow-2xl transition .2s ease p-10">
        <!-- Top Section -->
        <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
          <!-- Avatar -->
          <div class="relative">
            <img
              v-if="loginStore.currentUser?.image"
              :src="loginStore.currentUser.image"
              :alt="loginStore.currentUser?.name"
              class="w-44 h-44 rounded-full border-4 border-white shadow-xl object-cover"
            />
            <div
              v-else
              class="w-44 h-44 rounded-full bg-blue-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-xl"
            >
              {{ loginStore.currentUser?.name?.charAt(0) }}
            </div>
            <span
              class="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-2 border-white rounded-full"
            ></span>
          </div>

          <!-- User Info -->
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-4xl font-bold text-gray-800">
              {{ loginStore.currentUser?.name }}
            </h1>
            <p class="text-blue-600 text-lg font-medium mt-2 capitalize">
              {{ loginStore.currentUser?.role }}
            </p>
            <p class="text-gray-500 mt-2">
              {{ loginStore.currentUser?.email }}
            </p>

            <div class="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                @click="goHome"
                class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition cursor-pointer flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-5 h-5 text-gray-400 mr-3"
                >
                  <path d="M16 17l5-5-5-5"></path>
                  <path d="M21 12H9"></path>
                </svg>
                Home Dashboard
              </button>

              <button
                @click="logout"
                class="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition cursor-pointer"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="my-10 border-t"></div>

        <!-- Informations Grid -->
        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 class="font-semibold text-gray-700 mb-2">Téléphone</h3>
            <p class="text-gray-500">{{ loginStore.currentUser?.phone }}</p>
          </div>

          <div class="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 class="font-semibold text-gray-700 mb-2">Service</h3>
            <p class="text-gray-500">{{ loginStore.currentUser.service?loginStore.currentUser.service:'Non précisé' }}</p>
          </div>

          <div class="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 class="font-semibold text-gray-700 mb-2">Localisation</h3>
            <p class="text-gray-500">{{ loginStore.currentUser.city?loginStore.currentUser.city:'Non précisé' }}</p>
          </div>
        </div>

        <!-- Activity Section -->
        <div class="mt-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Activité récente</h2>

          <div class="space-y-4">
            <div class="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <span class="text-gray-600">Consultation patient #2458</span>
              <span class="text-sm text-gray-400">Il y a 2h</span>
            </div>

            <div class="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <span class="text-gray-600">Mise à jour dossier médical</span>
              <span class="text-sm text-gray-400">Hier</span>
            </div>

            <div class="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <span class="text-gray-600">Ajout nouveau patient</span>
              <span class="text-sm text-gray-400">Il y a 3 jours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fade-in animation for the card */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
</style>
