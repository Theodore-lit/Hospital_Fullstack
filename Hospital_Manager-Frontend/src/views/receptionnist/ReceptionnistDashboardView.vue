<script setup>
import SideBar from "@/layouts/SideBar.vue";
import { reactive } from "vue";
const aside = reactive([
  {
    title: "Dashboard",
    svg: "dashboard",
    link: "dashboard-receptionnist",
  },
  {
    title: "Patients",
    svg: "patients",
    link: "patients-reception",
  },
  {
    title: "Appointments",
    svg: "appointments",
    link: "all-appointments",
  },
  {
    title: "Rooms",
    svg: "rooms",
    link: "rooms-reception",
  },
]);
</script>

<template>
  <section class="flex h-screen">
    <!-- Sidebar -->
    <SideBar :aside="aside" class="w-64 fixed left-0 top-0 h-screen bg-white shadow-md" />

    <!-- Contenu -->
    <main class="flex-1 p-6 overflow-y-auto">
      <RouterView />
    </main>
  </section>
</template>

<style scoped></style>
