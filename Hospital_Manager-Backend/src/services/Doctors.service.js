import {Doctor} from '../models/Doctor.model.js'

export function findAvailable (){
    return Doctor.find({status: "disponible"})
}

export async function listDoctors({ page = 1, limit = 5, search, speciality }) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const filter = {};
  if (search) {
    // recherche simple sur fullname (regex)
    filter.name = { $regex: search, $options: "i" };
  }

  if (speciality) {
    filter.speciality = { $regex: speciality, $options: "i" };
  }

  const [items, total] = await Promise.all([
    Doctor.find(filter)
      .sort({ creatAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit),
    Doctor.countDocuments(filter),
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

export  function createDoctor(payload) {
  return Doctor.create(payload);
}


export function findOne(id) {
  return Doctor.findById(id);
}

export function updateDoctor(id, payload) {
  return Doctor.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  });
}

export function deleteDoctor(id) {
  return Doctor.findByIdAndDelete(id);
}