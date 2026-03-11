import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useReceptionnistsStore = defineStore('receptionnists', {
  state: () => ({
    receptionnists: [
      
    ],
    editedReceptionnists: null,
    isEdit: false,
    isFormOpen: false,
  }),

  persist: {
    paths: ['receptionnists'],
  },

  //   getters: {
  //     tasksByDoctor: (state) => {
  //       return (doctor) => {
  //         return state.patients.filter((patient) => patient.doctorId === doctor.id)
  //       }
  //     },
  //   },

  actions: {
    addReceptionnist(recept) {
      this.receptionnists.push(recept)
    },

    deleteReceptionnist(id) {
      this.receptionnists = this.receptionnists.filter((t) => t.id !== id)
    },
    setEditReceptionnist(receptionnist) {
      this.isEdit = true
      this.editedReceptionnists = receptionnist
    },

    updatedReceptionnist(receptionnist) {
      const modifiedReceptionnist = this.receptionnists.find(
        (t) => t.id === this.editedReceptionnists.id,
      )
      Object.assign(modifiedReceptionnist, receptionnist)
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
