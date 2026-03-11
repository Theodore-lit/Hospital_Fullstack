<script setup>
import { useLoginStore } from '@/stores/login'
import { usePatientsStore } from '@/stores/patient'

const loginSotore = useLoginStore()
const patients = usePatientsStore()
const doctor = loginSotore.currentUser
const doctorPatients = patients.patientsByDoctor(doctor)
</script>

<template>
  <div class="max-w-sm rounded overflow-hidden shadow-lg" v-for="patient in doctorPatients">
    <div class="relative">
      <img
        class="w-full clippy"
        src="https://images.pexels.com/photos/3779448/pexels-photo-3779448.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        alt="Sunset in the mountains"
      />
      <!-- <div
        class="clippy absolute bottom-0 left-0 top-0 right-0 bg-blue-700 bg-opacity-50 p-4 text-white flex flex-col justify-end items-center"
      ></div> -->
    </div>
    <div class="pt-3 pb-5 px-5 flex flex-col items-center">
      <p class="font-bold text-3xl">{{ patient.firstName }} {{ patient.lastName }}</p>
      <p
        class="font-semibold mb-2"
        :class="patient.status.type ? 'text-green-500' : 'text-red-500'"
      >
        {{ patient.status.message }}
      </p>
      <div class="flex flex-row align-center gap-6 justify-center">
        <div>Gender: {{ patient.gender }}</div>
        <div>BloodGroup: {{ patient.bloodGroup }}</div>
      </div>
      <div class="mt-5 flex flex-row gap-6 justify-center items-start">
        <div class="px-3 text-center">
          <svg
            class="ml-3 fill-blue-600"
            height="20px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            <path
              d="M224.2 89C216.3 70.1 195.7 60.1 176.1 65.4L170.6 66.9C106 84.5 50.8 147.1 66.9 223.3C104 398.3 241.7 536 416.7 573.1C493 589.3 555.5 534 573.1 469.4L574.6 463.9C580 444.2 569.9 423.6 551.1 415.8L453.8 375.3C437.3 368.4 418.2 373.2 406.8 387.1L368.2 434.3C297.9 399.4 241.3 341 208.8 269.3L253 233.3C266.9 222 271.6 202.9 264.8 186.3L224.2 89z"
            />
          </svg>
          <p class="text-gray-500">{{ patient.phone }}</p>
        </div>
        <div class="px-3 text-center">
          <svg
            class="ml-2 fill-blue-600"
            height="20px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            <path
              d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320zM208 496C208 451.8 243.8 416 288 416L352 416C396.2 416 432 451.8 432 496C432 504.8 424.8 512 416 512L224 512C215.2 512 208 504.8 208 496z"
            />
          </svg>
          <p class="text-gray-500">RDC5</p>
        </div>
        <div class="px-3 text-center">
          <svg
            class="ml-7 fill-blue-600"
            height="20px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            <path
              d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM480 496C488.8 496 496 488.8 496 480L496 416L408 416L408 496L480 496zM496 368L496 288L408 288L408 368L496 368zM360 368L360 288L280 288L280 368L360 368zM232 368L232 288L144 288L144 368L232 368zM144 416L144 480C144 488.8 151.2 496 160 496L232 496L232 416L144 416zM280 416L280 496L360 496L360 416L280 416zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176z"
            />
          </svg>
          <p class="text-gray-500">08/11/2006</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
