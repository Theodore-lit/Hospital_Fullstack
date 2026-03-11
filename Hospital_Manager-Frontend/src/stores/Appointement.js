import { defineStore } from 'pinia'
import { usePatientsStore } from './patient'
import { useDoctorsStore } from './doctor'
const now = new Date()
const day = String(now.getDate()).padStart(2, '0')
const month = String(now.getMonth() + 1).padStart(2, '0')
const year = now.getFullYear()

function getCurrentWeekRange() {
  const now = new Date()
  const day = now.getDay() || 7

  const start = new Date(now)
  start.setDate(now.getDate() - day + 1)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

const formattedDate = `${year}-${month}-${day}`
export const useAppointmentsStore = defineStore('Appointments', {
  state: () => ({
    searchQuery: '',
    doctorFilter: 'all',

    appointments: [
    ],
  }),

  persist: {
    paths: ['appointments'],
  },

  getters: {
    allAppointment(state) {
      return (patient, doctors) => {
        return state.appointments.map((apt) => ({
          doctors: doctors.find((doc) => doc.id == apt.doctorId),
          patient: patient.find((pat) => pat.id == apt.patientId),
          idAppoint: apt.id,
        }))
      }
    },

    allApointmentsByDoctor(state) {
      return (doctorPatients) => {
        return doctorPatients.flatMap((patient) =>
          state.appointments
            .filter((apt) => apt.patientId === patient.id)
            .map((apt) => ({
              patient: patient,
              idAppoint: apt.id,
            })),
        )
      }
    },

    appointmentsByDay(state) {
      return (doctorPatients) => {
        return doctorPatients.flatMap((patient) =>
          state.appointments
            .filter((apt) => apt.patientId == patient.id && apt.date.split('T')[0] == formattedDate)
            .map((apt) => ({
              patient: patient,
              idAppoint: apt.id,
            })),
        )
      }
    },
    appointmentsNumbers(state) {
      return state.appointments.length
    },
    appointmentsDayNumbers(state) {
      return state.appointments.filter((apt) => apt.date.split('T')[0] === formattedDate).length
    },
    appointmentsDayString(state) {
      return (day) => {
        return state.appointments.filter((apt) => {
          const date = new Date(apt.date)
          const jour = date.toLocaleDateString('fr-FR', { weekday: 'long' })
          return jour.toLowerCase() == day.toLowerCase()
        })
      }
    },

    filteredByPatient(state) {
      const patientsStore = usePatientsStore()
      const doctors = useDoctorsStore().doctors

      return patientsStore.patients.flatMap((p) => {
        const firstName = p.firstName || p.nom || ''
        const lastName = p.lastName || p.prenom || ''
        const fullName = `${firstName} ${lastName}`.toLowerCase()

        const matchesSearch = fullName.includes(state.searchQuery.toLowerCase())

        const matchesDoctor = state.doctorFilter === 'all' || p.doctorId === state.doctorFilter

        if (!matchesSearch || !matchesDoctor) return []

        return state.appointments
          .filter((apt) => apt.patientId === p.id)
          .map((apt) => ({
            doctors: doctors.find((doc) => doc.id == apt.doctorId),
            patient: p,
            idAppoint: apt.id,
          }))
      })
    },

    appointmentsThisWeek: (state) => {
      return (dayName) => {
        const { start, end } = getCurrentWeekRange()

        return state.appointments.filter((app) => {
          const date = new Date(app.date)

          const dayMap = {
            1: 'lundi',
            2: 'mardi',
            3: 'mercredi',
            4: 'jeudi',
            5: 'vendredi',
            6: 'samedi',
            0: 'dimanche',
          }

          return date >= start && date <= end && dayMap[date.getDay()] === dayName.toLowerCase()
        })
      }
    },
  },
  actions: {
    addAppointments(rdv) {
      this.appointments.push(rdv)
    },

    deleteAppointments(id) {
      this.appointments = this.appointments.filter((a) => a.id != id)
    },
  },
})
