import { Router } from "express";
import * as patientsController from "../controllers/patient.controller.js"; 
const router = Router()

router.get('/allpatients', patientsController.list)
router.get('/mypatients', patientsController.doctorPatients)
router.get('/needRoom', patientsController.patientNeedRoom)
router.get('/mypatients/:id', patientsController.doctorPatientsById)
router.put('/changestatus/:id', patientsController.changeStatus)
router.get('/:id', patientsController.findById)
router.post('/', patientsController.create)
router.put('/:id', patientsController.update)
router.delete('/:id', patientsController.remove)

export default router