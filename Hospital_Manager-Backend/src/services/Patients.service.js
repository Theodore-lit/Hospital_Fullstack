import { Patient } from "../models/Patients.model.js";

export async function listPatients({ page = 1, limit = 5, search, status }) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const filter = {};
  if (search) {
    // recherche simple sur fullname (regex)
    const fullName = `${filter.firstName}${filter.lastName}` 
    fullName = { $regex: search, $options: "i" };
  }

  if (status) {
    filter.status = { $regex: status, $options: "i" };
  }

  const [items, total] = await Promise.all([
    Patient.find(filter)
      .sort({ creatAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit),
    Patient.countDocuments(filter),
  ]);

  return {
    items,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
    },
  };
}

export  function createPatient(payload) {
  return Patient.create(payload);
}

export function findOne(id) {
  return Patient.findById(id);
}

export async function findByDoctor({id, page = 1, limit = 5, search, status }) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const filter = {};
  if (search) {
    // recherche simple sur fullname (regex)
    const fullName = `${filter.firstName}${filter.lastName}` 
    fullName = { $regex: search, $options: "i" };
  }

  if (status) {
    filter.status = { $regex: status, $options: "i" };
  }

  const [items, total] = await Promise.all([
    Patient.find(filter)
      .sort({ creatAt: -1 })
      .sort({doctorId: id})
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit),
    Patient.countDocuments(filter),
  ]);

  return {
    items,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
    },
  };
}



export async function findNeedRoom({id, page = 1, limit = 5, search}){
    const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const filter = {};
  filter.needRoom = true;
  if (search) {
    // recherche simple sur fullname (regex)
    const fullName = `${filter.firstName}${filter.lastName}` 
    fullName = { $regex: search, $options: "i" };
  }

  const [items, total] = await Promise.all([
    Patient.find(filter)
      .sort({ creatAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit),
    Patient.countDocuments(filter),
  ]);

  return {
    items,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
    },
  };
}

export function updatePatient(id, payload) {
  return Patient.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  });
}

export function deletePatient(id) {
  return Patient.findByIdAndDelete(id);
}
