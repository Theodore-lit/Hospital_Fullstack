<script setup>
import { useAppointmentsStore } from "@/stores/Appointement";
import { usePatientsStore } from "@/stores/patient";
import { useRoomStore } from "@/stores/room";
import { useNeedStore } from "@/stores/NeedRoom";
import ReceptionnistNeedRoomView from "./ReceptionnistNeedRoomView.vue";
import { computed, ref } from "vue";
const roomStore = useRoomStore();
const patientsStore = usePatientsStore();
const needRoomNumber = useNeedStore.needRoomNumber;

const appointmentsStore = useAppointmentsStore();
</script>

<template>
  <Transition v-if="modalPlanning">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="ro()"></div>

      <div
        class="relative bg-white rounded-2xl shadow-2xl transform transition-all sm:max-w-lg sm:w-full overflow-hidden"
      >
        <div class="absolute top-4 right-4">
          <button
            @click="ro()"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitRoom()" class="p-8">
          <div class="mb-6">
            <label
              class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2"
              >Choisir une Chambre</label
            >
            <div class="relative">
              <select
                class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 appearance-none font-medium text-slate-700 transition-all"
              >
                <option value="">Aucune chambre</option>
                <option v-for="room in roomStore.rooms" :key="room.id" :value="room.id">
                  {{ room.name }}
                </option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7" stroke-width="2" />
                </svg>
              </div>
            </div>
          </div>

          <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              @click="ro()"
              type="button"
              class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>

  <div class="min-h-screen px-10 py-8">
    <h1 class="text-3xl text-green-950 font-semibold">
      Portail de Gestion Médicale<span class="text-blue-600"></span>
    </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-12">
      <RouterLink
        :to="{ name: 'patients-reception' }"
        class="bg-white-50 rounded-2xl p-1 shadow-sm transition-transform hover:scale-[1.02]"
      >
        <div class="bg-blue-50 rounded-xl p-6">
          <div class="flex items-center w-full justify-between">
            <div class="w-2/3">
              <h3 class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Total Patients
              </h3>
              <!-- <div class="flex w-full items-center justify-between"> -->
              <p class="text-slate-700 text-4xl font-black mb-2">
                {{ patientsStore.patients.length }}
              </p>
              <p
                class="text-xs font-semibold uppercase text-blue-500 uppecrase transition-al"
              >
                Patients
              </p>
              <!-- </div> -->
            </div>

            <div
              class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center"
            >
              <svg class="w-7 h-7 fill-blue-600" viewBox="0 0 640 640">
                <path
                  d="M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 263.8 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z"
                />
              </svg>
            </div>
          </div>
        </div>
      </RouterLink>

      <div
        class="bg-white-50 rounded-2xl p-1 shadow-sm transition-transform hover:scale-[1.02]"
      >
        <div class="bg-red-50 rounded-xl p-5">
          <div class="flex items-center justify-between">
            <div>
              <h3
                class="text-slate-500 text-xs font-bold pt-1 uppercase tracking-wider mb-1"
              >
                Urgence hospi
              </h3>
              <p class="text-slate-700 text-4xl font-black mb-1">
                {{ needRoomNumber }}
              </p>
              <span
                class="text-xs font-semibold uppercase text-red-500 uppecrase transition-al"
                >Besoin de chambre</span
              >
            </div>
            <div class="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 fill-red-600" viewBox="0 0 640 640">
                <path
                  d="M309.8 72.6C297.5 61.2 278.5 61.2 266.3 72.6L42.3 280.6C32.7 289.6 29.5 303.5 34.3 315.7C39.1 327.9 50.8 336 64 336L80 336L80 512C80 547.3 108.7 576 144 576L340 576C318.8 546.5 305.7 510.7 304.1 472L272 472C263.2 472 256 464.8 256 456L256 416L216 416C207.2 416 200 408.8 200 400L200 368C200 359.2 207.2 352 216 352L256 352L256 312C256 303.2 263.2 296 272 296L304 296C312.8 296 320 303.2 320 312L320 352L340 352C374.9 303.5 431.7 272 496 272C506.7 272 517.1 272.9 527.3 274.5L309.8 72.6zM496 608C575.5 608 640 543.5 640 464C640 384.5 575.5 320 496 320C416.5 320 352 384.5 352 464C352 543.5 416.5 608 496 608zM496 508C507 508 516 517 516 528C516 539 507 548 496 548C485 548 476 539 476 528C476 517 485 508 496 508zM496 368C504.8 368 512 375.2 512 384L512 464C512 472.8 504.8 480 496 480C487.2 480 480 472.8 480 464L480 384C480 375.2 487.2 368 496 368z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <RouterLink
        :to="{ name: 'rooms-reception' }"
        class="bg-white-50 rounded-2xl p-1 shadow-md transition-transform hover:scale-[1.02]"
      >
        <div class="bg-slate-50 rounded-xl p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Total Chambres
              </h3>
              <p class="text-slate-700 text-4xl font-black mb-2">
                {{ roomStore.availableRooms.length }}
              </p>
              <p
                class="text-xs font-semibold uppercase text-slate-600 uppecrase transition-al"
              >
                Rooms dispo
              </p>
            </div>
            <div
              class="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center"
            >
              <svg class="w-7 h-7 fill-slate-700" viewBox="0 0 640 640">
                <path
                  d="M309.8 72.6C297.5 61.2 278.5 61.2 266.3 72.6L42.3 280.6C32.7 289.6 29.5 303.5 34.3 315.7C39.1 327.9 50.8 336 64 336L80 336L80 512C80 547.3 108.7 576 144 576L340 576C318.8 546.5 305.7 510.7 304.1 472L272 472C263.2 472 256 464.8 256 456L256 416L216 416C207.2 416 200 408.8 200 400L200 368C200 359.2 207.2 352 216 352L256 352L256 312C256 303.2 263.2 296 272 296L304 296C312.8 296 320 303.2 320 312L320 352L340 352C374.9 303.5 431.7 272 496 272C506.7 272 517.1 272.9 527.3 274.5L309.8 72.6zM640 464C640 384.5 575.5 320 496 320C416.5 320 352 384.5 352 464C352 543.5 416.5 608 496 608C575.5 608 640 543.5 640 464zM553.4 403.1C560.5 408.3 562.1 418.3 556.9 425.4L492.9 513.4C490.1 517.2 485.9 519.6 481.2 519.9C476.5 520.2 471.9 518.6 468.6 515.3L428.6 475.3C422.4 469.1 422.4 458.9 428.6 452.7C434.8 446.5 445 446.5 451.2 452.7L478 479.5L531 406.6C536.2 399.5 546.2 397.9 553.4 403.1z"
                />
              </svg>
            </div>
          </div>
        </div>
      </RouterLink>

      <RouterLink
        :to="{ name: 'all-appointments' }"
        class="bg-white-50 rounded-2xl p-1 shadow-sm transition-transform hover:scale-[1.02]"
      >
        <div class="bg-green-50 rounded-xl p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Détails planning
              </h3>
              <p class="text-slate-700 text-4xl font-black mb-2">
                {{ appointmentsStore.appointments.length }}
              </p>
              <p
                class="text-xs font-semibold uppercase text-emerald-600 uppecrase transition-al"
              >
                Rendez-vous
              </p>
            </div>
            <div
              class="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center"
            >
              <svg class="w-7 h-7 fill-emerald-600" viewBox="0 0 640 640">
                <path
                  d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM480 496C488.8 496 496 488.8 496 480L496 416L408 416L408 496L480 496zM496 368L496 288L408 288L408 368L496 368zM360 368L360 288L280 288L280 368L360 368zM232 368L232 288L144 288L144 368L232 368zM144 416L144 480C144 488.8 151.2 496 160 496L232 496L232 416L144 416zM280 416L280 496L360 496L360 416L280 416zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176z"
                />
              </svg>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>

    <ReceptionnistNeedRoomView />
  </div>
</template>

<style scoped></style>
