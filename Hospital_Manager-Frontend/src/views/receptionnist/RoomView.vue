<script setup>
import { useRoomStore } from "@/stores/room";
import { usePatientsStore } from "@/stores/patient";

const roomStore = useRoomStore();
const patientStore = usePatientsStore();

const getPatientName = (id) => {
  const p = patientStore.patients.find((patient) => patient.id === id);
  return p ? `${p.firstName} ${p.lastName}` : "Inconnu";
};
</script>

<template>
  <h1 class="text-3xl text-green-950 pl-5 mt-6 font-semibold text-center
  ">Gestionnaire d'unités médicales</h1>
  <!-- <div class="p-6 w-full flex justify-between gap-10"> -->
    <!-- <div class="w-2/3"> -->
      <div class="grid grid-cols-1 my-12 md:grid-cols-2 lg:grid-cols-4 gap-6 w-[80%] m-auto">
        <div
          v-for="room in roomStore.rooms"
          :key="room.id"
          class="rounded-lg shadow-sm p-4 transition hover:shadow-md"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-bold text-lg text-blue-900">{{ room.name }}</h2>
            <span
              :class="{
                'px-2 py-1 rounded text-xs font-bold': true,
                'bg-green-100 text-green-700': room.occupiedBy.length < room.capacity,
                'bg-red-100 text-red-700': room.occupiedBy.length === room.capacity,
              }"
            >
              {{ room.occupiedBy.length }} / {{room.capacity}} places
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 mb-4">
            <div
              v-for="n in room.capacity"
              :key="n"
              class="h-10 rounded shadow-sm flex items-center justify-center"
            >
              <svg
                v-if="room.occupiedBy[n - 1]"
                class="w-6 h-6 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              <span v-else class="text-gray-300 text-xs text-center leading-tight"
                >Lit Vide</span
              >
            </div>
          </div>

          <!-- <progress
          max="4"
          :value="room.occupiedBy.length"
          class="w-full rounded-full bg-white"
        ></progress> -->

          <!-- <div class="w-full bg-gray-300 rounded-lg overflow-hidden shadow-inner h-4"> -->

          <!-- </div> -->

          <ul class="text-sm space-y-1 pt-3">
            <li
              v-for="pId in room.occupiedBy"
              :key="pId"
              class="flex items-center text-gray-600"
            >
              <span class="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              {{ getPatientName(pId) }}
            </li>
            <li v-if="room.occupiedBy.length === 0" class="text-gray-400 italic">
              Chambre vide
            </li>
          </ul>
        </div>
      </div>
    <!-- </div> -->
    <!-- <div class="w-1/3 border">Ajout d'unité</div> -->
  <!-- </div> -->
</template>
