import { Router } from "express";
import { addPatient, allPatients, changeStatus, deletePatient, doctorPatients, doctorPatientsById, getPatientsById, patientNeedRoom, updatePatient } from "../controllers/patient.controller.js";
const router = Router()

router.get('/allpatients', allPatients)
router.get('/mypatients', doctorPatients)
router.get('/needRoom', patientNeedRoom)
router.get('/mypatients/:id', doctorPatientsById)
router.put('/changestatus/:id', changeStatus)
router.get('/:id', getPatientsById)
router.post('/', addPatient)
router.put('/:id', updatePatient)
router.delete('/:id', deletePatient)

export default router