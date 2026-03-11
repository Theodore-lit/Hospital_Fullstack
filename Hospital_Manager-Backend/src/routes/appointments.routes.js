import { Router } from "express";
import { addAppointments, allAppointments, appointmentsByDoctor, appointmentsOfDay, deleteAppointments } from "../controllers/appointments.controller.js";
const router = Router()
router.post('/', addAppointments)
router.get('/all', allAppointments)
router.get('/docappointmentsday', appointmentsOfDay)
router.get('/docappointments/:id', appointmentsByDoctor)
router.delete('/:id', deleteAppointments)
export default router