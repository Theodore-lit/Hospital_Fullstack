import {
  createReceptionnist,
  deleteReceptionnist,
  listReceptionnists,
  findOne,
  updateReceptionnist,
} from "../services/Receptionnist.service.js";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function list(req, res, next) {
  try {
    const { page, limit, search, speciatily } = req.query;
    const receptionnists = await listReceptionnists({ page, limit, search});
    return res.status(200).json(receptionnists.items);
    next()
  } catch (error) {
    return next(error);
  }
}


// rechercher un receptionnist par son id
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
    const receptionnist = await findOne(id);
    if (!receptionnist)
      return res.status(404).json({ error: { message: "Not found" } });
    res.status(200).json(receptionnist[0]);
    next()
  } catch (error) {
    next(error);
  }
}


export async function create(req, res, next) {
  const {name, service, phone, email, role, image} = req.body;
  try {
    const receptionnist = await createReceptionnist({name, service, phone, speciality, status, email, role, image});
    res.status(201).json({ message: "ok" });
    next()
  } catch (error) {
    next(error);
  }
}

// modifier un receptionnist

export async function update(req, res, next) {
  const id = req.params.id;
  const newInfo = req.body;
  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: {
          message: "Invalid id",
        },
      });
    }
    const receptionnist = await updateReceptionnist(id, newInfo);
    if (!receptionnist)
      return res.status(404).json({ error: { message: "Not found" } });
    res.status(201).json({ message: "ok" });
    next()
  } catch (error) {
    next(error);
  }
}

// supprimer un receptionnist

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
    const receptionnist = await deleteReceptionnist(id);
    res.status(200).json({ message: "ok" });
    next()
  } catch (error) {
    next(error);
  }
}
