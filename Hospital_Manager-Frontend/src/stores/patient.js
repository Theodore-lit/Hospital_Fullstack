import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'

export const usePatientsStore = defineStore('patients', {
  state: () => ({
    newAdd: null,
    searchQuery: '',
    statusFilter: 'all',
    patients: [],
  }),

  persist: {
    paths: ['patients'],
  },

  getters: {
    patientsByDoctor: (state) => {
      return (doctor) => {
        return state.patients.filter((patient) => patient.doctorId === doctor.id)
      }
    },

    patientFiltered: (state) => {
      return (patients) => {
        return patients.filter((patient) => {
          const firstName = patient.firstName || ''
          const lastName = patient.lastName || ''
          const fullName = `${firstName} ${lastName}`.toLowerCase()

          const matchesSearch = fullName.includes(state.searchQuery.toLowerCase())
          const matchesStatus =
            state.statusFilter === 'all' || patient.status === state.statusFilter
          return matchesSearch && matchesStatus
        })
      }
    },

    patientNeedRoom(state) {
      return state.patients.filter(
        (patient) => patient.needRoom && patient.status == 'Hospitalisation' && !patient.roomId,
      )
    },
  },

  actions: {

    notifNew(boolean){
      this.newAdd = boolean;
    },
  },
})
