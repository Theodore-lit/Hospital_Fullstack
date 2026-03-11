import { defineStore } from 'pinia'
import { usePatientsStore } from './patient'

export const useRoomStore = defineStore('room', {
  state: () => ({
    rooms: [
      {
        id: 1,
        name: 'A1',
        capacity: 4,
        occupiedBy: [],
      },
      {
        id: 2,
        name: 'A2',
        capacity: 4,
        occupiedBy: [],
      },
      {
        id: 3,
        name: 'B1',
        capacity: 6,
        occupiedBy: [],
      },
      {
        id: 4,
        name: 'B2',
        capacity: 4,
        occupiedBy: [],
      },
      {
        id: 5,
        name: 'C1',
        capacity: 4,
        occupiedBy: [],
      },
      {
        id: 6,
        name: 'C2',
        capacity: 4,
        occupiedBy: [],
      },
      {
        id: 7,
        name: 'D1',
        capacity: 4,
        occupiedBy: [],
      },
      {
        id: 8,
        name: 'D2',
        capacity: 4,
        occupiedBy: [],
      },
    ],
  }),
  getters: {
    availableRooms: (state) => {
      return state.rooms.filter((room) => room.occupiedBy.length < room.capacity)
    },

    getRoomById: (state) => (id) => state.rooms.find((r) => r.id === id),
  },
  actions: {
    assignPatientToRoom(roomId, patientId) {
      const room = this.rooms.find((r) => r.id === roomId)
      if (room && room.occupiedBy.length < room.capacity) {
        if (!room.occupiedBy.includes(patientId)) {
          room.occupiedBy.push(patientId)
        }
      }
    },

    removePatientFromRoom(patientId) {
      this.rooms.forEach((room) => {
        room.occupiedBy = room.occupiedBy.filter((id) => id !== patientId)
      })
    },
  },
})
