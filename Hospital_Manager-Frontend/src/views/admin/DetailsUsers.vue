<script setup>
import { useDoctorsStore } from '@/stores/doctor'
import { usePatientsStore } from '@/stores/patient'
import { ref, computed } from 'vue'

const search = ref('')

const patientStore = usePatientsStore()
const doctorStore = useDoctorsStore()

const patientsOfDoctor = computed(() => patientStore.patientsByDoctor(doctorStore.detailsDoctor))
const filteredPatients = computed(() => {
  return patientsOfDoctor.value.filter((patient) => {
    const fullName = (patient.firstName + ' ' + patient.lastName).toLowerCase()

    return fullName.includes(search.value.toLowerCase())
  })
})
</script>

<template>
  <section class="bg-gray-50 font-sans h-full mt-15">
    <div class="max-w-6xl mx-auto p-6">
      <div
        class="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100 flex flex-col md:flex-row items-center gap-6"
      >
        <div
          class="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold"
        >
          {{ doctorStore.detailsDoctor?.name[0] }}
        </div>
        <div class="flex-grow text-center md:text-left">
          <h1 class="text-2xl font-bold text-gray-800">{{ doctorStore.detailsDoctor?.name }}</h1>
          <p class="text-blue-600 font-medium">{{ doctorStore.detailsDoctor?.email }}</p>
          <div
            class="mt-2 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500"
          >
            <span
              ><i class="fas fa-id-card mr-2"></i>{{ doctorStore.detailsDoctor?.specialty }}</span
            >
            <span
              ><i class="fas fa-hospital mr-2"></i>{{ doctorStore.detailsDoctor?.experience }} ans
              d'experience</span
            >
            <span><i class="fas fa-envelope mr-2"></i>{{ doctorStore.detailsDoctor?.phone }}</span>
          </div>
        </div>
        <RouterLink :to="{ name: 'doctors-admin' }">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition shadow-md"
          >
            Retour sur la liste
          </button>
        </RouterLink>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">Patients Rattachés</h2>
          <div class="relative">
            <input
              v-model="search"
              type="text"
              placeholder="Rechercher un patient..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <i class="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th class="px-6 py-4 text-center">Nom</th>
                <th class="px-6 py-4 text-center">Genre</th>
                <th class="px-6 py-4 text-center">Statut</th>
                <th class="px-6 py-4">Phone</th>
                <th class="px-6 py-4 text-center">Groupe Sanguin</th>
                <th class="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody
              class="divide-y divide-gray-200 bg-white"
              v-if="doctorStore.detailsDoctor !== null"
            >
              <tr
                v-for="patient in filteredPatients"
                :key="patient.id"
                class="transition-all duration-300 hover:bg-indigo-50/50"
              >
                <td class="p-5 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-blue-700 font-bold border border-indigo-200 shadow-sm"
                    >
                      {{ patient.lastName ? patient.lastName.charAt(0).toUpperCase() : '?' }}
                    </div>
                    <div class="text-sm">
                      <p class="font-bold text-gray-900">
                        {{ patient?.firstName + ' ' + patient.lastName }}
                      </p>
                      <!-- <p class="text-gray-500 text-xs">{{ patient.lastName }}</p> -->
                    </div>
                  </div>
                </td>

                <td class="p-5 whitespace-nowrap text-center">
                  <span
                    class="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {{ patient.gender }}
                  </span>
                </td>

                <td class="p-5 whitespace-nowrap text-sm text-center font-mono text-gray-600">
                  {{ patient.status }}
                </td>

                <td class="p-5 text-sm text-gray-500 max-w-xs truncate text-center">
                  <div class="flex items-center gap-1">
                    {{ patient.phone }}
                  </div>
                </td>
                <td class="p-5 text-sm text-gray-500 max-w-xs truncate text-center">
                  <div class="flex items-center text-center gap-1">
                    {{ patient.bloodGroup }}
                  </div>
                </td>

                <td class="p-5 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex justify-center gap-3">
                    <button
                      @click="editDoctor(doctor)"
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
                      @click="deleteDoctor(doctor.id)"
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

              <tr v-if="filteredPatients.length === 0">
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
                    <p class="text-gray-400 italic text-lg">Aucun patient enregistré à ce nom</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
