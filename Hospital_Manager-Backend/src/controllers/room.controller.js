import ROOMS from "../data/rooms.json" with { type: "json" };
import PATIENTS from "../data/patients.json" with { type: "json" };
import fs from "fs";
import { log } from "console";

// toutes les unités médicaux
export const allRooms = (req, res) => {
  const limit = parseInt(req.query.limit ?? 10);
  const page = parseInt(req.query.page ?? 1);
  const search = req.query.search;
  const filterState = req.query.state;
  let roomsAll = [...ROOMS];
  if (page < 1 || limit < 1) {
    res.status(400).json({ message: "Page or limit must be >= 1" });
    return;
  }
  const start = (page - 1) * limit;
  let rooms = roomsAll.slice(start, start + limit);
  if (search) {
    rooms = roomsAll.filter(
      (room) => room.name.toLowerCase() == search.toLowerCase(),
    );
  }

  if (filterState || filterState !== "All") {
    if (filterState === "fully") {
      rooms = roomsAll.filter(
        (room) => room.occupiedBy.length == room.capacity,
      );
    }
    if (filterState === "empty") {
      rooms = roomsAll.filter((room) => room.occupiedBy.length == 0);
    }
    if (filterState === "morePlaces") {
      rooms = roomsAll.filter(
        (room) =>
          room.capacity - room.occupiedBy.length >
          Math.floor(room.capacity / 3),
      );
    }
    if (filterState === "underPlace") {
      rooms = roomsAll.filter(
        (room) =>
          room.capacity - room.occupiedBy.length <=
          Math.floor(room.capacity / 3),
      );
    }
  }
  res.status(200).json(rooms);
};
// toutes les unités médicaux disponible
export const availableRoms = (req, res) => {
  const rooms = ROOMS.filter((room) => room.occupiedBy.length < room.capacity);
  res.status(200).json(rooms);
};
// rechercher avec id
export const getRoomById = (req, res) => {
  const roomId = req.params.id;
  const room = ROOMS.find((room) => room.id === Number(roomId));
  if (!room) return res.status(404).json({ message: "Not found" });
  res.status(200).json(room);
};
// ajout - modification et suppression d'unités par l'admin
export const addRoom = (req, res) => {
  const room = req.body;
  if (!room.name || !room.capacity || !room.occupiedBy)
    return res.status(400).json({ message: "Bad request" });
  const data = fs.readFileSync("src/data/rooms.json", "utf-8");
  const rooms = [...data];
  room.id = Date.now();
  rooms.push(room);
  fs.writeFileSync("src/data/rooms.json", JSON.stringify(rooms, null, 2));
  res.status(200).json({ message: "OK" });
};
export const updateRoom = (req, res) => {
  const updated = req.body;
  const toUpdateId = req.params.id;
  const data = fs.readFileSync("src/data/rooms.json", "utf-8");
  const rooms = [...data];
  if (!toUpdateId.name && !toUpdateId.capacity)
    return res.status(204).json({ message: "bad request" });
  const index = rooms.findIndex((p) => p.id === toUpdateId);
  if (index != -1) {
    rooms[index] = { ...rooms[index], ...updated };
  }
  fs.writeFileSync("src/data/rooms.json", JSON.stringify(rooms, null, 2));
  res.status(200).json({ message: "updated" });
};
export const deleteRoom = (req, res) => {
  const roomId = req.params.id;
  let data = fs.readFileSync("src/data/rooms.json", "utf-8");
  let rooms = JSON.parse(data);
  let deletedRoom = rooms.find((room) => room.id == roomId);
  if (deletedRoom) {
    rooms = rooms.filter((room) => room.id !== roomId);
    fs.writeFileSync("src/data/rooms.json", JSON.stringify(rooms, null, 2));
    res.status(200).json({ message: "room deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
};
// assigné une unité à un patient
export const assignRoom = (req, res) => {
  
  const patientId = req.body.patientId;
  const roomId = req.body.roomId;
  const data = JSON.parse(fs.readFileSync("src/data/rooms.json", "utf-8"));
  const dataPatient = JSON.parse(fs.readFileSync("src/data/patients.json", "utf-8"));
  const patients = [...dataPatient];
  const rooms = [...data];
  
  const room = rooms.find((r) => r.id == roomId);
  
  if (!room) return res.status(400).json({ message: "Not found" });
  if (room.occupiedBy.length >= room.capacity)
    return res.status(204).json({ message: "Fully room" });
  room.occupiedBy.push(patientId);
  fs.writeFileSync("src/data/rooms.json", JSON.stringify(rooms, null, 2));
  fs.writeFileSync("src/data/patients.json", JSON.stringify(patients, null, 2));
  res.status(200).json({ message: "room assigned" });
};

// libérer un patient de son lit
export const desaignRoom = (req, res) => {
  const patientId = req.params.id;
  const data = JSON.parse(fs.readFileSync("src/data/rooms.json", "utf-8"));
  const rooms = [...data];  
  const room = rooms.find(r => r.occupiedBy.includes(patientId));  
  if (!room) return res.status(400).json({ message: "Not found" });
  let index = room.occupiedBy.indexOf(patientId);
  room.occupiedBy.splice(index, 1);
  fs.writeFileSync("src/data/rooms.json", JSON.stringify(rooms, null, 2));
  res.status(200).json({ message: "room assigned" });
};
