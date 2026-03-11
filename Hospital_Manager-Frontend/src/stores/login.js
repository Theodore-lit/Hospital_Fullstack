import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import doctorImg from '@/assets/doctor.jpg'
import adminImg from '@/assets/admin.jpg'
import receptionImg from '@/assets/receptionnist.jpg'

export const useLoginStore = defineStore('login', {
  state: () => ({
    isAuthentificated: '',
    currentUser:  [],
  }),

  persist: {},

  actions: {
    login(newuser) {
        this.isAuthentificated = true
        this.currentUser = newuser
      },
      logout() {
        this.isAuthentificated = ''
        this.currentUser = []
      // localStorage.removeItem('medicalUser')
    },
    addUser(user) {
      this.users.push(user)
    },
    removerUser(id) {
      this.users = this.users.filter((us) => us.id != id)
    },
  },
})
