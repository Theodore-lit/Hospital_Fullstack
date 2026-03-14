import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import doctorImg from '@/assets/doctor.jpg'
import adminImg from '@/assets/admin.jpg'
import receptionImg from '@/assets/receptionnist.jpg'

export const useLoginStore = defineStore('login', {
  state: () => ({
    token: null,
    currentUser:  [],
  }),

  persist: {},

  actions: {
    login(newuser) {
        this.token = newuser.token
        this.currentUser = newuser.data
      },
      logout() {
        this.token = null
        this.currentUser = []
    },
  },
})
