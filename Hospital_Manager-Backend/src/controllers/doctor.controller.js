import {
  findAvailable,
  createDoctor,
  deleteDoctor,
  listDoctors,
  findOne,
  updateDoctor,
} from "../services/Doctors.service.js";


function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function list(req, res, next) {
  try {
    const { page, limit, search, speciatily } = req.query;
    const doctors = await listDoctors({ page, limit, search, speciatily });
    return res.status(200).json(doctors.items);
  } catch (error) {
    return next(error);
  }
}

// rechercher un médecin par son id
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
    const Doctor = await findOne(id);
    if (!Doctor)
      return res.status(404).json({ error: { message: "Not found" } });
    res.status(200).json(Doctor[0]);
    next();
  } catch (error) {
    next(error);
  }
}

// les médecins disponible
export async function availableDoctors(req, res, next) {
  const doctors = await findAvailable();
  res.status(200).json(doctors);
  next();
}

export async function create(req, res, next) {
  const { name, service, phone, speciality, status, email, role, image } =
    req.body;
  try {
    const doctor = await createDoctor({
      name,
      service,
      phone,
      speciality,
      status,
      email,
      role,
      image,
    });
    req.doctor = doctor;
    req.password = req.body.password
    next();
  } catch (error) {
    next(error);
  }
}

// modifier un médecin

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
    const doctor = await updateDoctor(id, newInfo);
    if (!doctor)
      return res.status(404).json({ error: { message: "Not found" } });
    res.status(201).json({ message: "ok" });
    next();
  } catch (error) {
    next(error);
  }
}

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
    const doctor = await deleteDoctor(id);
    // res.status(200).json({ message: "ok" });
    next();
  } catch (error) {
    next(error);
  }
}
