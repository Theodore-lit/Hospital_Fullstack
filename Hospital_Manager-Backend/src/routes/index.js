import { Router } from "express";
const router = Router()
import userDash from './login.routes.js'
import patients from './patients.routes.js'
import appointments from './appointments.routes.js'
import rooms from './rooms.routes.js'
import doctors from './doctors.routes.js'
import receptionnists from './receptionnists.routes.js'
router.use('/user', userDash)
router.use('/patients', patients)
router.use('/appointments', appointments)
router.use('/rooms', rooms)
router.use('/doctors', doctors)
router.use('receptionnits', receptionnists)

export default router