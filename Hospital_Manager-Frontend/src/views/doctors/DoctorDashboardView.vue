<script setup>
import NavBar from "@/layouts/NavBar.vue";
import SideBar from "@/layouts/SideBar.vue";
import { reactive } from "vue";
import { RouterView } from "vue-router";

const aside = reactive([
  {
    title: "Dashboard",
    svg: "dashboard",
    link: "dashboard-doctor",
  },
  {
    title: "My Patients",
    svg: "mypatients",
    link: "mypatients",
  },
  {
    title: "My Appointements",
    svg: "myappointments",
    link: "myappointements",
  },
]);
</script>

<template>
  <section class="flex h-screen">
    <!-- Sidebar -->
    <SideBar :aside="aside" class="w-64 fixed left-0 top-0 h-screen shadow-md" />

    <!-- Contenu -->
    <main class="flex-1 p-6 overflow-y-auto">
      <RouterView />
    </main>
  </section>
</template>

<style scoped></style>
