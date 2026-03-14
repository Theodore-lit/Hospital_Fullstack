import { Router } from "express";
import {
  allRooms,
  getRoomById,
  assignRoom,
  deleteRoom,
  updateRoom,
  addRoom,
  availableRoms,
  desaignRoom,
} from "../controllers/room.controller.js";
const router = Router();

router.post("/", addRoom);
router.get("/all", allRooms);
router.post("/assign", assignRoom);
router.delete("/desassign", desaignRoom);
router.get("/available", availableRoms);
router.get("/:id", getRoomById);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

export default router;
