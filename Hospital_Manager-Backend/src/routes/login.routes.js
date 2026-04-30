import { Router } from "express";
import * as controllerslogin from "../controllers/login.controller.js";
const router = Router()

router.post('/login', controllerslogin.login)
router.post('/register', controllerslogin.create)
// router.delete('/', controllerslogin.remove)
// router.patch('/', controllerslogin.update)

export default router