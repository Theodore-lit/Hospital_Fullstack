import DOCTORS from "../data/doctors.json" with { type: "json" };

export const getDoctors = (req, res) => {
  const limit = parseInt(req.query.limit ?? 10);
  const page = parseInt(req.query.page ?? 1);
  const searchByName = req.query.search;
  const filterBySpeciatily = req.query.status;
  let doctors = [...DOCTORS];
  if (page < 1 || limit < 1) {
    res.status(400).json({ message: "Page or limit must be >= 1" });
    return;
  }
  const start = (page - 1) * limit;
  doctors = doctors.slice(start, start + limit);

  if (filterBySpeciatily || searchByName) {
    doctors = DOCTORS.filter((doc) => {
      const fullName = doc.name.toLowerCase();
      const matchesSearch = fullName.includes(searchByName.toLowerCase());
      const matchesSpeciality =
        filterBySpeciatily === "all" || doc.speciality === filterBySpeciatily;
      return matchesSearch && matchesSpeciality;
    });
  }
  res.status(200).json({ doctors });
};

// rechercher un médecin par son id
export const getDoctorById = (req, res) => {
  const doctorId = req.params.id;
  const doctor = DOCTORS.find((doc) => doc.id === Number(doctorId));
  if (doctor.length == 0)
    return res.status(400).json({ message: "Bad request" });
  res.status(200).json(doctor);
};

// les médecins disponible
export const availableDoctors = (req, res) => {
  const doctors = DOCTORS.filter((doc) => doc.status === "disponible");
  // if (doctors.length == 0)
  //   return res.status(204).json({ message: "No content" });
  res.status(200).json(doctors);
};

// ajout de médecins
export const addDoctor = (req, res) => {
  let templateDoctor = {
    id: Date.now(),
    password: "1234",
    role: "doctor",
    status: "disponible",
    service: "Praticien",
  };
  const newDoctor = req.body;

  if (
    !newDoctor.name &&
    !newDoctor.email &&
    !newDoctor.specialty &&
    !newDoctor.phone &&
    !newDoctor.experience &&
    !newDoctor.city
  )
    return res.status(400).json("Bad request");
  if (
    newDoctor.name &&
    newDoctor.email &&
    newDoctor.specialty &&
    newDoctor.phone &&
    newDoctor.experience &&
    newDoctor.city
  ) {
    templateDoctor = { ...newDoctor };
    let dataDoctors = fs.readFileSync("src/data/doctors.json", "utf-8");
    let dataUsers = fs.readFileSync("src/data/users.json", "utf-8");
    let users = JSON.parse(dataUsers);
    let doctors = JSON.parse(dataDoctors);
    doctors.push(templateDoctor);
    users.push(templateDoctor);
    fs.writeFileSync("src/data/doctors.json", JSON.stringify(doctors, null, 2));
    fs.writeFileSync("src/data/users.json", JSON.stringify(users, null, 2));
    res.status(201).json({ message: "patient added" });
  }
};

// modifier un médecin
export const updateDoctor = (req, res) => {
  let data = fs.readFileSync("src/data/doctors.json", "utf-8");
  let dataUsers = fs.readFileSync("src/data/users.json", "utf-8");
  let users = JSON.parse(dataUsers);
  let doctors = JSON.parse(data);
  const updateId = res.params.id;
  const toUpdate = res.body;
  const index = doctors.findIndex((p) => p.id === updateId);
  const indexUser = users.findIndex((p) => p.id === updateId);
  if (toUpdate.role || toUpdate.id)
    return res.status(400).json({ message: "Bad request" });
  if (
    index !== -1 &&
    (toUpdate.name ||
      toUpdate.email ||
      toUpdate.specialty ||
      toUpdate.phone ||
      toUpdate.experience ||
      toUpdate.city)
  ) {
    doctors[index] = { ...doctors[index],...toUpdate };
    users[indexUser] = { ...doctors[index],...toUpdate };
    fs.writeFileSync("src/data/doctors.json", JSON.stringify(doctors, null, 2));
    fs.writeFileSync("src/data/users.json", JSON.stringify(users, null, 2));
    res.status(201).json({ message: "update sucessfully" });
  } else {
    res.status(400).json({ message: "Not found" });
  }
};

// suppression d'un médecin
export const removeDoctor = (req, res) => {
  const doctorId = req.params.id;
  let dataDoc = fs.readFileSync("src/data/doctors.json", "utf-8");
  let dataUsers = fs.readFileSync("src/data/users.json", "utf-8");
  let doctors = JSON.parse(dataDoc);
  let users = JSON.parse(dataUsers);
  let deletedDoc = doctors.find((doc) => doc.id == doctorId);
  let deletedUser = users.find((us) => us.id == doctorId);
  if (deletedDoc || deletedUser) {
    doctors = doctors.filter((doc) => doc.id !== doctorId);
    users = users.filter((us) => us.id !== doctorId);
    fs.writeFileSync("src/data/doctors.json", JSON.stringify(doctors, null, 2));
    fs.writeFileSync("src/data/users.json", JSON.stringify(doctors, null, 2));
    res.status(200).json({ message: "patient deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
};
