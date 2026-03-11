import { defineStore } from 'pinia'

import { useLoginStore } from './login'

export const useDoctorsStore = defineStore('doctors', {
  state: () => ({
    doctors: [
    ],
    editedDoctor: null,
    isEdit: false,
    isFormOpen: false,
    detailsDoctor: null,
  }),

  persist: {
    paths: ['doctors'],
  },

  getters: {
    doctorsInWork(state) {
      return state.doctors.filter((apt) => apt.inWork === 'oui').length
    },
    availableDoctors(state) {
      return state.doctors.filter((doc) => doc.status === 'disponible')
    },
  },

  actions: {
    addDoctor(patient) {
      this.doctors.push(patient)
    },

    deleteDoctor(id) {
      this.doctors = this.doctors.filter((t) => t.id !== id)
    },
    setEditDoctor(doctor) {
      this.isEdit = true
      this.editedDoctor = doctor
    },
    setDetailsDoctor(doctor) {
      this.detailsDoctor = doctor
    },

    putUnavailable(id) {
      this.doctors.find((doc) => doc.id == id).status = 'indisponible'
    },

    updatedDoctor(doctor) {
      const loginStore = useLoginStore()
      const modifiedDoctor = this.doctors.find((t) => t.id === this.editedDoctor.id)
      Object.assign(modifiedDoctor, doctor)
      this.isEdit = false
    },

    openForm() {
      this.isFormOpen = true
    },

    closeForm() {
      this.isFormOpen = false
    },
  },
})
