<script setup>
import { useReceptionnistsStore } from '@/stores/receptionnist'
import { computed, ref } from 'vue'

const search = ref('')
const receptStore = useReceptionnistsStore()

const filteredReceptionnist = computed(() => {
  return receptStore.receptionnists.filter((t) =>
    t.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()),
  )
})
const receptionnistStore = useReceptionnistsStore()

function deleteReceptionnist(id) {
  receptionnistStore.deleteReceptionnist(id)
}

function editReceptionnist(receptionnist) {
  receptionnistStore.setEditReceptionnist(receptionnist)
  receptionnistStore.openForm()
}

function openFormModal() {
  receptionnistStore.openForm()
}
</script>

<template>
  <form @submit.prevent="handleSearch" class="w-full max-w-xl mx-auto mt-10 mb-12">
    <div class="relative flex items-center group">
      <input
        v-model="search"
        type="text"
        placeholder="Search tools, doctors, patients..."
        class="w-full h-14 pl-14 pr-32 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
      />
      <div class="absolute left-5 text-gray-400 group-focus-within:text-sky-500 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <button
        type="submit"
        class="absolute right-2 h-10 px-6 bg-blue-600 text-white rounded-xl font-medium shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all duration-200"
      >
        Search
      </button>
    </div>
  </form>
  <div class="mx-14 mt-10">
    <div
      class="flex items-center justify-between bg-white p-6 rounded-t-xl border-x border-t border-gray-300 shadow-sm"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Annuaire des réceptionnistes</h2>
        <p class="text-sm text-gray-500">Gérez les receptionnistes et leurs informations</p>
      </div>

      <button
        @click="openFormModal"
        class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold tracking-wide text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <span
          class="absolute inset-0 w-full h-full bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
        ></span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 transition-transform duration-300 group-hover:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span class="relative">Ajouter un receptionniste</span>
      </button>
    </div>

    <div class="overflow-hidden border border-gray-300 rounded-b-xl shadow-md bg-white">
      <table class="table-auto min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="p-5 text-left text-sm font-semibold text-gray-900 capitalize">
              Docteur
            </th>
            <th scope="col" class="p-5 text-left text-sm font-semibold text-gray-900 capitalize">
              Spécialité
            </th>
            <th scope="col" class="p-5 text-left text-sm font-semibold text-gray-900 capitalize">
              Téléphone
            </th>
            <th scope="col" class="p-5 text-left text-sm font-semibold text-gray-900 capitalize">
              Ville
            </th>
            <th scope="col" class="p-5 text-center text-sm font-semibold text-gray-900 capitalize">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="receptionnist in filteredReceptionnist"
            :key="receptionnist.id"
            class="transition-all duration-300 hover:bg-indigo-50/50"
          >
            <td class="p-5 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-blue-700 font-bold border border-indigo-200 shadow-sm"
                >
                  {{ receptionnist.name ? receptionnist.name.charAt(0).toUpperCase() : '?' }}
                </div>
                <div class="text-sm">
                  <p class="font-bold text-gray-900">{{ receptionnist?.name }}</p>
                  <p class="text-gray-500 text-xs">{{ receptionnist.email }}</p>
                </div>
              </div>
            </td>

            <td class="p-5 whitespace-nowrap">
              <span
                class="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100"
              >
                {{ receptionnist.specialty }}
              </span>
            </td>

            <td class="p-5 whitespace-nowrap text-sm font-mono text-gray-600">
              {{ receptionnist.phone }}
            </td>

            <td class="p-5 text-sm text-gray-500 max-w-xs truncate">
              <div class="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {{ receptionnist.city }}
              </div>
            </td>

            <td class="p-5 whitespace-nowrap text-center text-sm font-medium">
              <div class="flex justify-center gap-3">
                <button
                  @click="editReceptionnist(receptionnist)"
                  title="Modifier"
                  class="p-2 rounded-lg text-blue-600 hover:bg-blue-700 hover:text-white transition-all duration-200 border border-indigo-100 hover:shadow-md"
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
                  @click="deleteReceptionnist(receptionnist.id)"
                  title="Supprimer"
                  class="p-2 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 border border-red-100 hover:shadow-md"
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

          <tr v-if="receptionnistStore.receptionnists.length == 0">
            <td colspan="5" class="p-16 text-center">
              <div class="flex flex-col items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p class="text-gray-400 italic text-lg">
                  Aucun receptionniste enregistré pour le moment.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
