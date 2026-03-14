import { Router } from "express";
import * as controllerReceptionnist from "../controllers/receptionnist.controller.js";
const router = Router();
router.get('/', controllerReceptionnist.findById )
router.get('/:id', controllerReceptionnist.findById )
router.post('/', controllerReceptionnist.create )
router.put('/:id', controllerReceptionnist.update )
router.delete('/:id', controllerReceptionnist.remove )


export default router;
