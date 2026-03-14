import PATIENTS from "../data/patients.json" with { type: "json" };
import DOCTORS from "../data/doctors.json" with { type: "json" };
import ROOMS from "../data/rooms.json" with { type: "json" };

import mongoose from "mongoose";
import {
  createPatient,
  listPatients,
  findOne,
  findNeedRoom,
  updatePatient,
  deletePatient,
} from "../services/patients.service.js";

import {session} from './login.controller.js'
export let PATIENTSdoctor = [];
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
// tous les patients suivie avec pagination, recherche et filtrage
export async function list(req, res, next) {
    try {
    const { page, limit, search, category } = req.query;
    const patient = await listPatients({ page, limit, search, category });
    return res.status(200).json(patient.items);
  } catch (error) {
    return next(error);
  }
};

// les patients selon le docteur
export async function doctorPatients(req, res, next) {
  
  try {
    const {page, limit, search, category } = req.query;
    // const doctorId = req.params.id;
    const doctorId = session.curUser.id;
    const patient = await listPatients({ doctorId,page, limit, search, category });
    return res.status(200).json(patient.items);
  } catch (error) {
    return next(error);
  }
};

// les patients d'un doc par id
export async function doctorPatientsById(req, res) {
  const id = req.params.id;
  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: {
          message: "Invalid id",
        },
      });
    }
    const patient = await findOne(id);
    if (!patient) return res.status(404).json({error: {message: "Not found"}})
    res.status(200).json({ patient});
  } catch (error) {
    next(error);
  }
}

// obtenir les patients par id
// export const getPatientsById = (req, res) => {
//   const patientId = req.params.id;
//   const patient = PATIENTS.find((patient) => patient.id === Number(patientId));
//   let doctor = DOCTORS.find((doc) => doc.id === Number(patient.doctorId));
//   if (doctor) doctor = { name: doctor.name, speciality: doctor.speciality };
//   let room = ROOMS.find((room) => room.id === Number(patient.roomId));
//   if (room) room = { name: room.name };
//   if (patient) {
//     res.status(200).json({ patient, doctor, room });
//   } else {
//     res.status(404).json({ message: "Not found" });
//   }
// };

export async function findById(req, res, next) {
  const id = req.params.id;
  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: {
          message: "Invalid id",
        },
      });
    }
    const patient = await findOne(id);
    if (!patient) return res.status(404).json({error: {message: "Not found"}})
    res.status(200).json(patient);
  } catch (error) {
    next(error);
  }

}

// les patients qui sont en urgence
export async function patientNeedRoom(req, res, next) {
  try {
    const { page, limit, search, category } = req.query;
    const patients = await findNeedRoom(page, limit, search,);
    if (!patients) return res.status(404).json({error: {message: "Not found"}})
    res.status(200).json(patients.items);
  } catch (error) {
    next(error);
  }
};

// demander une urgence de chambre
export async function changeStatus(req, res, next){
  const newStatus = req.body;
  const id = req.params.id;
  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: {
          message: "Invalid id",
        },
      });
    }
    const patient = await updatePatient(id, newStatus);
    if (newStatus.status == "Hospitalisation") {
      await updatePatient(id, {
        needRoom: true
      })
    };
    if (!patient) return res.status(404).json({error: {message: 'Not found'}})
    res.status(200).json({ message: "ok" });
  } catch (error) {
    next(error);
  }
};

export async function create(req, res, next) {
  const newPatient = req.body;
  try {
    const patient = await createPatient(newPatient);
    res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  const id = req.params.id;
  const newInfo = req.body
  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: {
          message: "Invalid id",
        },
      });
    }
    const patient = await updatePatient(id, newInfo);
    if (!patient) return res.status(404).json({error: {message: 'Not found'}})
    res.status(201).json({ message: "ok" });
  } catch (error) {
    next(error);
  }
}

// supprimer un patient
export async function remove(req, res, next) {
  const id = req.params.id;
  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: {
          message: "Invalid id",
        },
      });
    }
    const patient = await deletePatient(id);
    res.status(200).json({ message: "ok" });
  } catch (error) {
    next(error);
  }

}

