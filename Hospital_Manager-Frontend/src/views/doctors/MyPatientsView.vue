<script setup>
import { useLoginStore } from "@/stores/login";
import { usePatientsStore } from "@/stores/patient";
import { useRoomStore } from "@/stores/room";
import { onMounted } from "vue";
const roomStore = useRoomStore();
const loginSotore = useLoginStore();
const patients = usePatientsStore();
const doctor = loginSotore.currentUser;
// const doctorPatients = patients.patientsByDoctor(doctor);

let myPatients = []
async function doctorPatients() {
  const data = await fetch('http://localhost:3000/api/patients/mypatients');
  const res = await data.json();
  myPatients = [...res]
}
onMounted(doctorPatients)
</script>

<template>
  <div class="mx-12 mt-8">
    <h1 class="text-3xl text-green-950 font-semibold tracking-tight">
      Tableau de suivi des patients
    </h1>

    <div
      class="flex flex-col md:flex-row gap-4 my-7 items-center bg-white/80 backdrop-blur-md p-2 pl-6 rounded-lg shadow-sm border border-slate-200"
    >
      <div class="flex items-center flex-1 w-full gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="patients.searchQuery"
          type="text"
          placeholder="Rechercher un dossier patient..."
          class="bg-transparent border-none focus:ring-0 w-full text-slate-700 placeholder-slate-400 py-3"
        />
      </div>

      <div class="flex items-center gap-2 pr-2 w-full md:w-auto">
        <select
          v-model="patients.statusFilter"
          class="bg-slate-50 border-none text-slate-600 text-sm font-semibold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
        >
          <option value="all">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="Consultation">Consultation</option>
          <option value="Hospitalisation">Hospitalisation</option>
          <option value="Sorti">Sorti</option>
        </select>
      </div>
    </div>
    <div
      class="bg-white shadow-xl mt-12 rounded-2xl overflow-hidden border border-slate-200"
    >
      <table class="min-w-full text-sm text-left">
        <!-- HEADER -->
        <thead class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
          <tr>
            <th class="px-6 py-4">Patient</th>
            <th class="px-6 py-4">Statut</th>
            <th class="px-6 py-4">Genre</th>
            <th class="px-6 py-4">Groupe sanguin</th>
            <th class="px-6 py-4">Téléphone</th>
            <th class="px-6 py-4">Chambre</th>
            <th class="px-6 py-4">Date naissance</th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="patient in myPatients"
            :key="patient.id"
            class="hover:bg-slate-50 transition"
          >
            <!-- Patient -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 rounded-full bg-linear-to-br from-indigo-100 to-indigo-200 flex items-center justify-center font-semibold text-indigo-700 text-sm"
                >
                  {{ patient.firstName[0] }}{{ patient.lastName[0] }}
                </div>
                <span class="font-medium text-slate-800">
                  {{ patient.firstName }} {{ patient.lastName }}
                </span>
              </div>
            </td>

            <!-- Status -->
            <td class="px-6 py-4">
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold"
                :class="
                  patient.status == 'En attente'
                    ? 'bg-yellow-100 text-yellow-700'
                    : patient.status == 'Consultation'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                "
              >
                {{ patient.status }}
              </span>
            </td>

            <!-- Gender -->
            <td class="px-6 py-4 text-slate-600">
              {{ patient.gender }}
            </td>

            <!-- Blood group -->
            <td class="px-6 py-4 text-slate-600 font-medium">
              {{ patient.bloodGroup }}
            </td>

            <!-- Phone -->
            <td class="px-6 py-4 text-slate-600">
              {{ patient.phone }}
            </td>

            <!-- Room (valeur statique conservée) -->
            <td class="px-6 py-4 text-slate-600">
              <span
                v-if="patient.roomId"
                class="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold"
              >
                {{ roomStore.rooms.find((r) => r.id === patient.roomId)?.name || "N/A" }}
              </span>
              <span v-else class="text-xs text-slate-300 italic">Non assignée</span>
            </td>

            <!-- Date (valeur statique conservée) -->
            <td class="px-6 py-4 text-slate-600">08/11/2006</td>
          </tr>
          <tr v-if="myPatients.length == 0">
            <td colspan="7" class="p-16 text-center">
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
                <p class="text-gray-400 italic text-lg">Aucun patient assigné.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
