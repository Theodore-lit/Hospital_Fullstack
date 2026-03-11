<script setup>
import { usePatientsStore } from '@/stores/patient'
import { useRoomStore } from '@/stores/room'
import { onMounted, ref } from 'vue'
import { computed } from 'vue'
import { useNeedStore } from '@/stores/NeedRoom'
const needRoomStore = useNeedStore()
const roomStore = useRoomStore()
let patientsNeedRoom = ref([])

async function needRoom() {
  const data = await fetch('http://localhost:3000/api/patients/needRoom')
  if (!data.ok) throw new Error()
  const res = await data.json()
  patientsNeedRoom.value = [...res]
  needRoomStore.giveNumber(needRoom.length)
}

const patientsStore = usePatientsStore()
// const needRoom = computed(() => patientsStore.patientNeedRoom)
let newRoomId = ref(null)
async function giveRoom(patientId) {
  // if (form.value.roomId) {
  const data = await fetch('http://localhost:3000/api/rooms/assign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ patientId: patientId, roomId: newRoomId.value }),
  })
  if (!data.ok) {
    console.log("Impossible d'éffectuer cette action")
  }
  // }

  // patientsStore.giveRoom(patientId, newRoomId.value)
  // roomStore.assignPatientToRoom(newRoomId.value, patientId)
  // newRoomId.value = ''
}

onMounted(needRoom)
</script>

<template>
  <div class="my-24">
    <h2 class="text-xl pl-2 text-red-500 font-semibold">Urgence Hospi</h2>
    <div
      class="bg-white border rounded-2xl border-slate-200 my-7 shadow-xl shadow-slate-200/50 overflow-hidden"
    >
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50">
            <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Patient & Date
            </th>
            <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Chambre
            </th>
            <th
              class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center"
            >
              Groupe
            </th>
            <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              État actuel
            </th>
            <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Assigner une chambre
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="patient in patientsNeedRoom"
            :key="patient.id"
            class="group hover:bg-blue-50/30 transition-all duration-200"
          >
            <td class="px-6 py-5">
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm"
                >
                  {{ patient.firstName[0] }}{{ patient.lastName[0] }}
                </div>
                <div>
                  <p class="font-bold text-slate-900 leading-tight">
                    {{ patient.firstName }} {{ patient.lastName }}
                  </p>
                  <!-- <p class="text-xs text-slate-400 mt-0.5">ID: #{{ patient.id.toString().slice(-5) }}</p> -->
                  <p
                    class="text-[10px] text-blue-500 font-medium mt-0.5 uppercase tracking-tighter"
                  >
                    Admis le : {{ patient.createdAt || 'Date inconnue' }}
                  </p>
                </div>
              </div>
            </td>

            <td class="px-6 py-5 text-center">
              <span
                v-if="patient.roomId"
                class="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold"
              >
                {{ roomStore.rooms.find((r) => r.id === patient.roomId)?.name }}
              </span>
              <span v-else class="text-xs text-slate-300 italic">Non assignée</span>
            </td>

            <td class="px-6 py-5">
              <div class="flex justify-center">
                <span
                  class="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-black border border-red-100"
                >
                  {{ patient.bloodGroup }}
                </span>
              </div>
            </td>

            <td class="px-6 py-5">
              <span
                :class="{
                  'bg-amber-50 text-amber-700 border-amber-100': patient.status === 'En attente',
                  'bg-blue-50 text-blue-700 border-blue-100': patient.status === 'Consultation',
                  'bg-emerald-50 text-emerald-700 border-emerald-100': patient.status === 'Sorti',
                }"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
              >
                <span
                  :class="{
                    'bg-amber-400': patient.status === 'En attente',
                    'bg-blue-400': patient.status === 'Consultation',
                    'bg-emerald-400': patient.status === 'Sorti',
                  }"
                  class="h-1.5 w-1.5 rounded-full animate-pulse"
                ></span>
                {{ patient.status }}
              </span>
            </td>

            <td>
              <div class="relative w-full max-w-sm group">
                <div class="relative flex items-center">
                  <select
                    v-model="newRoomId"
                    @change="giveRoom(patient.id)"
                    class="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none cursor-pointer"
                  >
                    <option value="" class="text-slate-400">-- Sans chambre --</option>
                    <option
                      v-for="room in roomStore.availableRooms"
                      :key="room.id"
                      :value="room.id"
                      class="text-slate-700"
                    >
                      {{ room.name }} • {{ 4 - room.occupiedBy.length }} places dispo.
                    </option>
                  </select>

                  <div
                    class="pointer-events-none absolute right-3 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />

                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </td>
            <td v-if="patient.roomId">Chambre assigné</td>
          </tr>
          <tr v-if="patientsNeedRoom.length == 0">
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
                  Aucun patient en urgence d'hospitalisation.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- <div v-if="manageStore.filteredPatients.length === 0" class="py-20 text-center">
        <p class="text-slate-400 font-medium">Aucun patient ne correspond à votre recherche.</p>
      </div> -->
    </div>
  </div>
</template>

<style scoped></style>
