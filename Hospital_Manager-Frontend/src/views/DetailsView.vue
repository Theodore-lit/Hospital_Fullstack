<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePatientsStore } from "@/stores/patient";
import { useRoomStore } from "@/stores/room";
import { useDoctorsStore } from "@/stores/doctor";

const route = useRoute();
const router = useRouter();
const patientStore = usePatientsStore();
const doctorStore = useDoctorsStore();
const roomStore = useRoomStore();

let room = ref(null);
let patient = ref(null);
let doctor = ref(null);

const patientId = computed(() => parseInt(route.query.id));
async function detailsPatient(){  
  const data = await fetch(`http://localhost:3000/api/patients/${patientId.value}`)
  const res = await data.json()
  patient.value = res.patient;
  if (res.room) room.value = res.room;
  if (res.doctor) doctor.value = res.doctor;
}

// const patient = computed(() =>
//   patientStore.patients.find((p) => p.id === patientId.value)
// );

// const room = computed(() => {
//   if (!patient.value?.roomId) return null;
//   return roomStore.rooms.find((r) => r.id === patient.value.roomId);
// });
// const doctor = computed(() => {
//   if (!patient.value?.doctorId) return null;
//   return doctorStore.doctors.find((d) => d.id === patient.value.doctorId);
// });

const goBack = () => router.back();

onMounted(detailsPatient)
</script>

<template>
  <div v-if="patient" class="p-6 max-w-5xl mx-auto pt-20">
    <div class="flex items-center justify-between mb-8">
      <button
        @click="goBack"
        class="flex items-center text-slate-500 hover:text-blue-600 transition-colors font-semibold"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Retour à la liste
      </button>
      <div class="flex gap-3">
        <span
          class="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-400"
        >
          ID: #{{ patient.id.toString().slice(-6) }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-25">
      <div class="lg:col-span-1 space-y-6">
        <div
          class="bg-white rounded-lg p-8 border border-slate-100 shadow-xl shadow-slate-200/50 text-center"
        >
          <div
            class="h-24 w-24 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black"
          >
            {{ patient.firstName[0] }}{{ patient.lastName[0] }}
          </div>
          <h1 class="text-2xl font-black text-slate-900">
            {{ patient.firstName }} {{ patient.lastName }}
          </h1>
          <p class="text-slate-400 font-medium mb-6">
            {{ patient.gender === "M" ? "Homme" : "Femme" }}
          </p>

          <div
            :class="{
              'bg-amber-50 text-amber-700': patient.status === 'En attente',
              'bg-blue-50 text-blue-700': patient.status === 'Consultation',
              'bg-emerald-50 text-emerald-700': patient.status === 'Sorti',
            }"
            class="inline-block px-6 py-2 rounded-2xl text-sm font-bold border border-current opacity-80"
          >
            {{ patient.status }}
          </div>
        </div>

        <div
          class="bg-white p-6 rounded-lg border border-slate-100 shadow-lg shadow-slate-200/40"
        >
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">
            Contact
          </h3>
          <div class="space-y-4">
            <div class="flex items-center gap-3 text-slate-600">
              <div
                class="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"
              >
                📞
              </div>
              <span class="font-semibold">{{ patient.phone || "Non renseigné" }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div
          class="bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg p-9.5 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden"
        >
          <div class="relative z-10">
            <h3 class="text-blue-200 text-xs font-black uppercase tracking-[0.2em] mb-6">
              Position du patient
            </h3>

            <div class="flex items-end justify-between">
              <div>
                <p class="text-4xl font-black mb-2">
                  {{ room ? room.name : "Non assigné" }}
                </p>
              </div>
              <div v-if="room" class="h-14 w-14">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="fill-white"
                  viewBox="0 0 640 640"
                >
                  <path
                    d="M64 96C81.7 96 96 110.3 96 128L96 352L320 352L320 224C320 206.3 334.3 192 352 192L512 192C565 192 608 235 608 288L608 512C608 529.7 593.7 544 576 544C558.3 544 544 529.7 544 512L544 448L96 448L96 512C96 529.7 81.7 544 64 544C46.3 544 32 529.7 32 512L32 128C32 110.3 46.3 96 64 96zM144 256C144 220.7 172.7 192 208 192C243.3 192 272 220.7 272 256C272 291.3 243.3 320 208 320C172.7 320 144 291.3 144 256z"
                  />
                </svg>

                <!-- ********************************************les chambres******************************************************************************* -->
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-lg p-8 border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <h3 class="text-slate-900 text-lg font-black mb-8 flex items-center gap-2">
            <span class="h-5 w-1.5 bg-red-500 rounded-full"></span>
            Données Médicales
          </h3>

          <div class="grid grid-cols-2 gap-8">
            <div class="p-6 bg-red-50/50 border border-red-100">
              <p class="text-red-400 text-xs font-black uppercase mb-1">Groupe Sanguin</p>
              <p class="text-3xl font-black text-red-600">{{ patient.bloodGroup }}</p>
            </div>

            <div class="p-6 bg-slate-50 border border-slate-100">
              <p class="text-slate-400 text-xs font-black uppercase mb-1">
                Médecin Référent
              </p>
              <p class="text-xl font-bold text-slate-700">
                {{ doctor ? "Dr. " + doctor.name : "Non assigné" }}
              </p>

              <p v-if="doctor" class="text-xs text-blue-500 font-medium">
                {{ doctor.speciality }}
              </p>
            </div>
          </div>
        </div>
        <!-- <div class="mt-8">
            <h4 class="text-slate-900 font-bold mb-4">Observations</h4>
            <div class="p-6 bg-slate-50  border border-slate-100 text-slate-500 italic">
              Aucune observation particulière enregistrée pour ce patient.
            </div>
            <input type="text" placeholder="Aucune observation particulière enregistrée pour ce patient." class="p-6 bg-slate-50  border border-slate-100 text-slate-500 italic">
          </div> -->
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center h-[60vh]">
    <p class="text-slate-400 font-bold text-xl">Patient introuvable</p>
    <button @click="goBack" class="mt-4 text-blue-600 font-bold underline">Retour</button>
  </div>
</template>

<style scoped></style>
