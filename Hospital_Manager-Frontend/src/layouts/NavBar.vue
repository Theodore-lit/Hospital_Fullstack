<script setup>
import { useLoginStore } from "@/stores/login";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import Swal from "sweetalert2";

const isOpen = ref(false);

const loginStore = useLoginStore();
const router = useRouter();
const route = useRoute();

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

async function stateConnection() {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, logout",
    cancelButtonText: "Cancel",
  });
  if (result.isConfirmed) {
    await loginStore.logout();
    router.replace({ name: "login" });
  }
}


</script>

<template>
  <div class="relative w-full">
    <nav
      class="sticky top-0 backdrop-blur-md bg-blue-100 transition-all duration-300 relative z-50"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <div class="flex items-center group">
            <div
              class="bg-blue-600 group-hover:bg-blue-700 p-2 rounded-lg transition-colors duration-300"
            >
              <!-- 🏥 SVG Hospital -->
              <svg
                class="w-5 h-5 fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
              >
                <path
                  d="M64 112C64 85.5 85.5 64 112 64L160 64C177.7 64 192 78.3 192 96C192 113.7 177.7 128 160 128L128 128L128 256C128 309 171 352 224 352C277 352 320 309 320 256L320 128L288 128C270.3 128 256 113.7 256 96C256 78.3 270.3 64 288 64L336 64C362.5 64 384 85.5 384 112L384 256C384 333.4 329 398 256 412.8L256 432C256 493.9 306.1 544 368 544C429.9 544 480 493.9 480 432L480 346.5C442.7 333.3 416 297.8 416 256C416 203 459 160 512 160C565 160 608 203 608 256C608 297.8 581.3 333.4 544 346.5L544 432C544 529.2 465.2 608 368 608C270.8 608 192 529.2 192 432L192 412.8C119 398 64 333.4 64 256L64 112zM512 288C529.7 288 544 273.7 544 256C544 238.3 529.7 224 512 224C494.3 224 480 238.3 480 256C480 273.7 494.3 288 512 288z"
                />
              </svg>
            </div>
            <span
              class="ml-3 text-xl font-bold text-blue-600 group-hover:text-white transition-colors duration-300 capitalize"
              >Dotóóxwé</span
            >
          </div>

          <div class="flex items-center space-x-4" v-if="loginStore.token">
            <div class="hidden md:block h-6 w-px bg-white mx-2"></div>

            <div class="dropdown relative group">
              <button
                @click="toggleDropdown"
                class="flex items-center space-x-3 focus:outline-none p-1.5 rounded-2xl hover:bg-gray-100/50 transition-all duration-200"
                
              >
                <div class="relative">
                  <div
                    class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden border-2 border-white shadow-sm"
                  >
                    <img
                      :src="loginStore.currentUser?.image"
                      :alt="loginStore.currentUser?.role"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <span
                    class="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"
                  ></span>
                </div>

                <div class="hidden lg:flex flex-col items-start leading-tight">
                  <span class="text-sm font-bold text-blue-500">{{
                    loginStore.currentUser?.name
                  }}</span>
                  <span
                    class="text-[10px] uppercase font-bold text-white tracking-wider"
                    >{{ loginStore.currentUser?.role }}</span
                  >
                </div>

                <i
                  class="fas fa-chevron-down text-[10px] text-gray-400 group-hover:text-blue-600 transition-transform duration-200"
                ></i>
              </button>

              <div
                class="dropdown-menu absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100 transform transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 -translate-y-2"
              >
                <div class="px-5 py-4 border-b border-gray-50">
                  <div class="flex items-center">
                    <div
                      class="h-11 w-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 overflow-hidden mr-3 border border-blue-100"
                    >
                      <img
                        :src="loginStore.currentUser?.image"
                        alt="User"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div class="overflow-hidden">
                      <p class="font-bold text-gray-900 truncate">
                        {{ loginStore.currentUser?.name }}
                      </p>
                      <p class="text-xs text-gray-500 truncate">
                        {{ loginStore.currentUser?.email }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="p-2 space-y-1">
                  <RouterLink
                    to="/info-user"
                    class="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl flex items-center transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5 mr-3 opacity-70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    My Profile
                  </RouterLink>

                  <div class="border-t border-gray-50 my-1 mx-2"></div>

                  <a
                    @click="stateConnection"
                    class="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl flex items-center transition-all duration-200 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5 mr-3 opacity-70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    {{ loginStore.token ? "Sign out" : "Sign in" }}
                  </a>
                </div>
              </div>
            </div>

            <button
              id="mobile-menu-button"
              class="md:hidden p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <i class="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.nav-link {
  position: relative;
  transition: all 0.3s ease;
}
.nav-link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: currentColor;
  transition: width 0.3s ease;
}
.nav-link:hover::after {
  width: 100%;
}
.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.dropdown-menu {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
.mobile-menu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}
.mobile-menu.open {
  max-height: 1000px;
  transition: max-height 0.5s ease-in;
}
.badge {
  font-size: 0.65rem;
  top: -0.5rem;
  right: -0.5rem;
}
.avatar-ring {
  box-shadow: 0 0 0 2px white, 0 0 0 4px #3b82f6;
}
</style>
