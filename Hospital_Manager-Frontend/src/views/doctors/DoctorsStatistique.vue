<script setup>
import { useLoginStore } from "@/stores/login";
import { usePatientsStore } from "@/stores/patient";
import { useAppointmentsStore } from "@/stores/Appointement";
import { ref } from "vue";
import { useRoomStore } from "@/stores/room";
const roomStore = useRoomStore();
const appointmentsStore = useAppointmentsStore();
const loginStore = useLoginStore();
const patients = usePatientsStore();
const doctor = loginStore.currentUser;
const doctorPatients = patients.patientsByDoctor(doctor);
const appointments = appointmentsStore.appointments;
const date = (id) => {
  const appoint = appointments.find((apt) => apt.id == id);
  const [date, heure] = appoint.date.split("T");
  return `${heure}`;
};

let myRooms = new Set();
roomStore.rooms.forEach((r) => {
  if (doctorPatients.find((p) => p.roomId == r.id)) {
    myRooms.add(r.name);
  }
});
myRooms = [...myRooms];
function statusChanger(statusId, status) {
  let patient = doctorPatients.find((patient) => patient.id == statusId);
  patient.status = status;
}

let modalDelete = ref(null);
let removeId;
function yesRemove() {
  appointmentsStore.deleteAppointments(removeId);
  modalDelete.value = false;
}
const confirmDelete = (id) => {
  removeId = id;
  modalDelete.value = true;
};

const getStatusClass = (status) => {
  switch (status) {
    case "En attente":
      return "bg-amber-400 text-white py-1 rounded-full px-3 max-w-[100%]";
    case "Consultation":
      return "bg-blue-400 text-white py-1 rounded-full px-3 max-w-[100%]";
    case "Sorti":
      return "bg-emerald-400 text-white py-1 rounded-full px-3 max-w-[100%]";
    case "Hospitalisation":
      return "bg-red-500 text-red-100 py-1 rounded-full px-3 max-w-[100%]";
    default:
      return "";
  }
};
</script>

<template>
  <Transition v-if="modalDelete">
    <div
      class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur confirm-dialog"
    >
      <div class="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
        <div class="opacity-25 w-full h-full absolute z-10 inset-0"></div>
        <div
          class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative shadow-lg"
        >
          <div class="md:flex items-center">
            <div
              class="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto"
            >
              <i class="bx bx-error text-3xl"> &#9888; </i>
            </div>
            <div class="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <p class="font-bold">Warning!</p>
              <p class="text-sm text-gray-700 mt-1">
                Êtes-vous sûr de vouloir supprimer ce patient ? Cette action libérera
                également son lit.
              </p>
            </div>
          </div>
          <div class="text-center md:text-right mt-4 md:flex md:justify-end">
            <button
              @click="yesRemove()"
              id="confirm-delete-btn"
              class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2"
            >
              Delete
            </button>
            <button
              @click="modalDelete = false"
              id="confirm-cancel-btn"
              class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <div class="mx-12 mt-4">
    <h1 class="text-3xl text-green-950 font-semibold">Tableau de bord Médecin</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-18 mt-15">
      <!-- Users Card -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Patients</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ doctorPatients.length }}
            </p>
            <div class="flex items-center mt-2">
              <span class="text-green-600 text-sm font-medium flex items-center">
                <i class="fas fa-arrow-up mr-1"></i>
                {{ (doctorPatients.length * 100) / patients.patients.length }} %
              </span>
              <span class="text-gray-500 text-sm ml-2">vs all patients</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg
              class="fill-green-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              <path
                d="M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 263.8 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z"
              />
            </svg>
            <i class="fas fa-users text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Daily's Appointments</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ appointmentsStore.appointmentsDayNumbers }}
            </p>
            <div class="flex items-center mt-2">
              <span class="text-gray-900 text-sm font-medium flex items-center">
                <i class="fas fa-arrow-up mr-1"></i>
                5%
              </span>
              <span class="text-gray-500 text-sm ml-2">de plus</span>
            </div>
          </div>
          <div
            class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path
                d="M424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64zM160 176C151.2 176 144 183.2 144 192L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 192C496 183.2 488.8 176 480 176L160 176zM390.7 241.9C398.5 231.2 413.5 228.8 424.2 236.6C434.9 244.4 437.3 259.4 429.5 270.1L307.4 438.1C303.3 443.8 296.9 447.4 289.9 447.9C282.9 448.4 276 445.9 271.1 441L215.2 385.1C205.8 375.7 205.8 360.5 215.2 351.2C224.6 341.9 239.8 341.8 249.1 351.2L285.1 387.2L390.7 242z"
              />
            </svg>
            <i class="fas fa-box text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Week's appointments</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ appointmentsStore.appointmentsNumbers }}
            </p>
            <div class="flex items-center mt-2">
              <RouterLink
                :to="{ name: 'myappointements' }"
                class="text-blue-600 text-sm font-medium flex items-center"
              >
                <!-- <i class="fas fa-arrow-up mr-1"></i> -->
                Voir tout →
              </RouterLink>
              <span class="text-gray-500 text-sm ml-2"></span>
            </div>
          </div>
          <div
            class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
          >
            <svg
              class="fill-orange-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              <path
                d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM480 496C488.8 496 496 488.8 496 480L496 416L408 416L408 496L480 496zM496 368L496 288L408 288L408 368L496 368zM360 368L360 288L280 288L280 368L360 368zM232 368L232 288L144 288L144 368L232 368zM144 416L144 480C144 488.8 151.2 496 160 496L232 496L232 416L144 416zM280 416L280 496L360 496L360 416L280 416zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176z"
              />
            </svg>
            <i class="fas fa-shopping-cart text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div>
          <p class="text-sm font-medium text-gray-600">Work's Rooms</p>
          <div class="flex justify-between">
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ myRooms.length }}
            </p>
            <div class="flex h-18 w-18 overflow-auto items-center mt-2">
              <div class="flex flex-wrap flex-col gap-1 overflow-hidden">
                <p
                  v-for="roms in myRooms"
                  class="text-green-800 text-sm font-medium flex items-center"
                >
                  {{ roms }}
                </p>
              </div>
              <span class="text-gray-500 text-sm ml-2"></span>
            </div>
          </div>
        </div>
        <!-- <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <svg class="fill-orange-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path
              d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM480 496C488.8 496 496 488.8 496 480L496 416L408 416L408 496L480 496zM496 368L496 288L408 288L408 368L496 368zM360 368L360 288L280 288L280 368L360 368zM232 368L232 288L144 288L144 368L232 368zM144 416L144 480C144 488.8 151.2 496 160 496L232 496L232 416L144 416zM280 416L280 496L360 496L360 416L280 416zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176z"
            />
          </svg>
          <i class="fas fa-shopping-cart text-orange-600 text-xl"></i>
        </div> -->
      </div>

      <!-- Products Card -->
    </div>
    <div class="mt-24">
      <h2 class="text-xl text-green-950 font-semibold">Consultation(s) du jour</h2>
      <div
        class="bg-white border border-gray-200 rounded-xl mt-12 shadow-sm overflow-hidden"
      >
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr class="text-gray-500 uppercase text-xs tracking-wide">
              <th class="px-6 py-4 text-left">First Name</th>
              <th class="px-6 py-4 text-left">Last Name</th>
              <th class="px-6 py-4 text-left">Room</th>
              <th class="px-6 py-4 text-left">Date</th>
              <th class="px-6 py-4 text-left">Hours</th>
              <th class="px-6 py-4 text-left">Status</th>
              <th class="px-6 py-4 text-left">
                Actions
                <span class="text-red-400 normal-case font-medium">
                  (Editing of status)
                </span>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr
              v-if="appointmentsStore.appointmentsByDay(doctorPatients).length != 0"
              v-for="patient in appointmentsStore.appointmentsByDay(doctorPatients)"
              :key="patient.idAppoint"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 font-medium text-gray-800">
                {{ patient.patient.firstName }}
              </td>

              <td class="px-6 py-4 text-gray-700">
                {{ patient.patient.lastName }}
              </td>

              <td class="px-6 py-4 text-gray-700">
                {{
                  roomStore.getRoomById(patient.patient.roomId)
                    ? roomStore.getRoomById(patient.patient.roomId).name
                    : "Non assigné"
                }}
              </td>

              <td class="px-6 py-4 text-gray-600">
                {{ date(patient.idAppoint).date }}
              </td>

              <td class="px-6 py-4 text-gray-600">
                {{ date(patient.idAppoint).heure }}
              </td>

              <td class="px-6 py-4">
                <span
                  :class="getStatusClass(patient.patient.status)"
                  class="text-sm font-medium"
                >
                  {{ patient.patient.status }}
                </span>
              </td>

              <td class="px-6 py-4">
                <select
                  class="border border-gray-300 px-3 py-1.5 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  v-model="patient.patient.status"
                  @change="statusChanger(patient.patient.id, patient.patient.status)"
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Hospitalisation">Hospitalisation</option>
                  <option value="Sorti">Sorti</option>
                </select>
              </td>
            </tr>

            <tr v-if="appointmentsStore.appointmentsByDay(doctorPatients).length == 0">
              <td colspan="7" class="py-16 text-center text-gray-400 italic">
                Aucun rendez-vous programmé en ce jour.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
