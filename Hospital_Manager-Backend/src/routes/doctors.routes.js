import { Router } from "express";
import * as controllerDoctor from "../controllers/doctor.controller.js";
import * as controllerslogin from "../controllers/login.controller.js";
const router = Router()
router.get('/', controllerDoctor.list );
// router.post('/', controllerDoctor.create, controllerslogin.create )
router.get('/available', controllerDoctor.availableDoctors)
router.get('/:id', controllerDoctor.findById );
router.put('/:id', controllerDoctor.update );
router.delete('/:id', controllerDoctor.remove, controllerslogin.remove )

export default router