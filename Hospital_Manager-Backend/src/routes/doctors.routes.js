import { Router } from "express";
import { removeDoctor,updateDoctor, addDoctor, availableDoctors, getDoctorById, getDoctors } from "../controllers/doctor.controller.js";
const router = Router()
router.get('/', getDoctors);
router.post('/', addDoctor)
router.get('/available', availableDoctors)
router.get('/:id', getDoctorById);
router.put('/:id', updateDoctor);
router.delete('/:id', removeDoctor)

export default router