import { defineStore } from 'pinia'
import { usePatientsStore } from './patient'
import { useRoomStore } from './room'

export const usePatientManageStore = defineStore('patientManage', {
  state: () => ({
    searchQuery: '',
    statusFilter: 'all',
    selectedPatientForEdit: null,
  }),

  getters: {
    filteredPatients: (state) => {
      const baseStore = usePatientsStore()
      const roomStore = useRoomStore()

      return baseStore.patients
        .filter((p) => {
          const firstName = p.firstName || p.nom || ''
          const lastName = p.lastName || p.prenom || ''
          const fullName = `${firstName} ${lastName}`.toLowerCase()

          const matchesSearch = fullName.includes(state.searchQuery.toLowerCase())
          const matchesStatus = state.statusFilter === 'all' || p.status === state.statusFilter
          return matchesSearch && matchesStatus
        })
        .map((patient) => {
          const room = roomStore.rooms.find((r) => r.id === patient.roomId)
          return {
            ...patient,
            roomName: room ? room.name : 'Non assigné',
          }
        })
    },
  },

  actions: {
    setEditPatient(patient) {
      this.selectedPatientForEdit = { ...patient }
    },

    clearEdit() {
      this.selectedPatientForEdit = null
    },

    updatePatient(updatedPatient) {
      const baseStore = usePatientsStore()
      const index = baseStore.patients.findIndex((p) => p.id === Number(updatedPatient.id))

      if (index !== -1) {
        baseStore.patients[index] = { ...updatedPatient }
        this.clearEdit()
      }
    },
  },
})
