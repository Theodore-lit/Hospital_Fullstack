import {Receptionnist} from '../models/Receptionnists.model.js'

export async function listReceptionnists({ page = 1, limit = 5, search}) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const filter = {};
  if (search) {
    // recherche simple sur fullname (regex)
    filter.name = { $regex: search, $options: "i" };
  }

  const [items, total] = await Promise.all([
    Receptionnist.find(filter)
      .sort({ creatAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit),
    Receptionnist.countDocuments(filter),
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

export  function createReceptionnist(payload) {
  return Receptionnist.create(payload);
}


export function findOne(id) {
  return Receptionnist.findById(id);
}

export function updateReceptionnist(id, payload) {
  return Receptionnist.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  });
}

export function deleteReceptionnist(id) {
  return Receptionnist.findByIdAndDelete(id);
}