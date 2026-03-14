<script setup>
import { ref } from 'vue'
import { useLoginStore } from '@/stores/login'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const email = ref('')
const password = ref('')
const cannotConnect = ref(false)
const loginStore = useLoginStore()

async function login() {
  const data = await fetch('http://localhost:3000/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })

  if (data.ok) {
    const currentUser = await data.json()
    loginStore.login(currentUser)

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      width: 370,
      title: 'connexion avec succès',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: 'my-swal-height',
      },
    })
    const roleRoute = {
      admin: 'dashboard-admin',
      doctor: 'dashboard-doctor',
      receptionnist: 'dashboard-receptionnist',
    }
    router.push({ name: roleRoute[currentUser.data?.role] })
  } else {
    cannotConnect.value = true
  }
}
</script>

<template>
  <div class="img relative min-h-screen w-full flex items-center justify-center bg-gray-100 px-6">
    <!-- Overlay plus doux pour un look pro -->
    <div class="absolute inset-0 bg-slate-900/80"></div>

    <div class="relative z-10 w-full max-w-md bg-blue rounded-2xl shadow-xl p-8 backdrop-blur-xl">
      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-3">
          <div class="bg-blue-700 text-white p-3 rounded-full shadow-md">
            <svg
              class="h-8 w-8 fill-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              <path
                d="M264 112L376 112C380.4 112 384 115.6 384 120L384 160L256 160L256 120C256 115.6 259.6 112 264 112zM208 120L208 160L128 160C92.7 160 64 188.7 64 224L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 224C576 188.7 547.3 160 512 160L432 160L432 120C432 89.1 406.9 64 376 64L264 64C233.1 64 208 89.1 208 120zM288 280C288 271.2 295.2 264 304 264L336 264C344.8 264 352 271.2 352 280L352 320L392 320C400.8 320 408 327.2 408 336L408 368C408 376.8 400.8 384 392 384L352 384L352 424C352 432.8 344.8 440 336 440L304 440C295.2 440 288 432.8 288 424L288 384L248 384C239.2 384 232 376.8 232 368L232 336C232 327.2 239.2 320 248 320L288 320L288 280z"
              />
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-gray-200 tracking-tight">Personnel Médical</h2>
        <p class="text-gray-200 mt-1 text-sm font-medium">Authentification</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="login" class="space-y-5">
        <!-- Email -->
        <div>
          <label class="block text-sm font-bold text-gray-200 mb-1.5">Adresse Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="nom@hopital.fr"
            class="w-full border-gray-300 text-sm text-gray-300 focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all outline-none border-b-2"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-bold text-gray-200 mb-1.5">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full text-gray-300 border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all outline-none border-b-2"
          />

          <p v-if="cannotConnect" class="text-red-600 text-xs mt-2 font-medium">
            ⚠️ Identifiants invalides. Veuillez réessayer.
          </p>
        </div>

        <!-- Remember + Forgot -->
        <div class="flex items-center justify-between">
          <div class="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 cursor-pointer"
            />
            <label for="remember" class="ml-2 text-sm font-medium text-gray-200 cursor-pointer"
              >Rester connecté</label
            >
          </div>
          <a href="#" class="text-sm font-semibold text-blue-500 hover:underline"> Oublié ? </a>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full text-white bg-blue-700 hover:bg-blue-800 cursor-pointer focus:outline-none font-bold rounded-md text-sm px-5 py-3 text-center transition-colors shadow-sm"
        >
          SE CONNECTER
        </button>
      </form>

      <div
        class="mt-8 pt-6 border-t border-gray-100 text-center text-[11px] uppercase tracking-wider text-gray-400 font-semibold"
      >
        Système de Santé Sécurisé
      </div>
    </div>
  </div>
</template>

<style scoped>
.img {
  background-image: url('../assets/iStock-1189304032.webp');
  background-size: cover;
  background-position: center;
}
.my-swal-height {
  min-height: 100px !important;
  padding: 10px !important;
  border-radius: 20px !important;
}
</style>
