import { Router } from "express";
import {
  addRecept,
  getRecept,
  getReceptById,
  updateRecept,
  removeRecept,
} from "../controllers/receptionnist.controller.js";
const router = Router();
router.get('/', getRecept)
router.get('/:id', getReceptById)
router.post('/', addRecept)
router.put('/:id', updateRecept)
router.delete('/:id', removeRecept)


export default router;
