<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}

function goHome() {
  router.push({ name: 'login' })
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-indigo-900 text-white px-6"
  >
    <div class="text-center max-w-md">
      <h1 class="text-6xl font-extrabold mb-4">403</h1>
      <h2 class="text-2xl font-semibold mb-2">Accès non autorisé</h2>
      <p class="text-gray-300 mb-8">
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </p>

      <div class="flex justify-center gap-4">
        <button
          @click="goBack"
          class="bg-white text-red-700 font-semibold px-5 py-2 rounded-xl shadow hover:bg-gray-100 transition"
        >
          Retour
        </button>

        <button
          @click="goHome"
          class="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl shadow transition"
        >
          Accueil
        </button>
      </div>
    </div>
  </div>
</template>
