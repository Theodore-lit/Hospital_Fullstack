import PATIENTS from "../data/patients.json" with { type: "json" };
import DOCTORS from "../data/doctors.json" with { type: "json" };
import ROOMS from "../data/rooms.json" with { type: "json" };
// import DOCTOR from ".../data/doctors.json" with { type: "json" };
export let PATIENTSdoctor = [];
import fs, { readFileSync } from "fs";
// tous les patients suivie avec pagination, recherche et filtrage
export const allPatients = (req, res) => {
  const limit = parseInt(req.query.limit ?? 10);
  const page = parseInt(req.query.page ?? 1);
  const searchByName = req.query.search;
  const filterByStatus = req.query.status;
  let patients = [...PATIENTS];
  if (page < 1 || limit < 1) {
    res.status(400).json({ message: "Page or limit must be >= 1" });
    return;
  }
  const start = (page - 1) * limit;
  patients = patients.slice(start, start + limit);

  if (filterByStatus || searchByName) {
    patients = PATIENTS.filter((patient) => {
      const firstName = patient.firstName || "";
      const lastName = patient.lastName || "";
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchByName.toLowerCase());
      const matchesStatus =
        filterByStatus === "all" || patient.status === filterByStatus;
      return matchesSearch && matchesStatus;
    });
  }
  res.status(200).json({ patients });
};

// les patients selon le docteur
export const doctorPatients = (req, res) => {
  const doctor = req.body;
  const limit = parseInt(req.query.limit ?? 12);
  const page = parseInt(req.query.page ?? 1);
  const searchByName = req.query.search;
  const filterByStatus = req.query.status;
  let patients = PATIENTS.filter((patient) => patient.doctorId === doctor.id);
  if (page < 1 || limit < 1) {
    res.status(400).json({ error: "Page or limit must be >= 1" });
    return;
  }
  const start = (page - 1) * limit;
  patients = patients.slice(start, start + limit);
  if (filterByStatus || searchByName) {
    patients = PATIENTS.filter((patient) => {
      const firstName = patient.firstName || "";
      const lastName = patient.lastName || "";
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchByName.toLowerCase());
      const matchesStatus =
        filterByStatus === "all" || patient.status === filterByStatus;
      return matchesSearch && matchesStatus;
    });
  }
  if (patients.length == 0) return res.status(204).json({ message: "empty" });
  PATIENTSdoctor = [...patients];
  res.status(200).json(patients);
};

// les patients d'un doc par id
export const doctorPatientsById = (req, res) => {
  const patientId = req.params.id;
  const patient = PATIENTSdoctor.find(
    (patient) => patient.id === Number(patientId),
  );
  if (patient) {
    res.status(200).json(patient);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

// obtenir les patients par id
export const getPatientsById = (req, res) => {
  const patientId = req.params.id;
  const patient = PATIENTS.find((patient) => patient.id === Number(patientId));
  let doctor = DOCTORS.find((doc) => doc.id === Number(patient.doctorId));
  if (doctor) doctor = { name: doctor.name, speciality: doctor.speciality };
  let room = ROOMS.find((room) => room.id === Number(patient.roomId));
  if (room) room = { name: room.name };
  if (patient) {
    res.status(200).json({ patient, doctor, room });
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

// les patients qui sont en urgence
export const patientNeedRoom = (req, res) => {
  let patients = PATIENTS.filter(
    (patient) =>
      patient.needRoom &&
      patient.status == "Hospitalisation" &&
      !patient.roomId,
  );
  if (patients.length == 0) return res.status(204).json({ message: "empty" });
  res.status(200).json(patients);
};

// demander une urgence de chambre
export const changeStatus = (req, res) => {
  const patientId = req.params.id;
  const newStatus = req.body;
  let pat = PATIENTSdoctor.find((pat) => pat.id === Number(patientId));
  if (!pat) return res.status(404).json({ message: "Not found" });
  let data = fs.readFileSync("src/data/patients.json", "utf-8");
  let patients = JSON.parse(data);
  let patient = patients.find((patient) => patient.id === Number(patientId));
  patient.status = newStatus;
  if (newStatus == "Hospitalisation") patient.needRoom = true;
  fs.writeFileSync("src/data/patients.json", JSON.stringify(patients, null, 2));
  res.status(200).json({ message: "OK" });
};

// changer de status

// ajout des patients
export async function addPatient(req, res) {
  const patient = req.body;
  patient.id = Date.now();
  patient.createdAt = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  try {
    if (
      patient.firstName &&
      patient.lastName &&
      patient.gender &&
      patient.phone &&
      patient.bloodGroup &&
      patient.status
    ) {
      const data = fs.readFileSync("src/data/patients.json", "utf-8");
      const patients = JSON.parse(data);
      patients.push(patient);
      fs.writeFileSync(
        "src/data/patients.json",
        JSON.stringify(patients, null, 2),
      );
      if (patient.roomId) {
        const dataRooms = JSON.parse(
          fs.readFileSync("src/data/rooms.json", "utf-8"),
        );
        const rooms = [...dataRooms];
        const room = rooms.find((r) => r.id == patient.roomId);
        if (room.occupiedBy.length < room.capacity)
          room.occupiedBy.push(patient.id);
        fs.writeFileSync("src/data/rooms.json", JSON.stringify(rooms, null, 2));
      }
      if (patient.aptDate) {
        const data = fs.readFileSync("src/data/appointments.json", "utf-8");
        let appointments = data.json();
        if (
          !appointments.find(
            (x) =>
              new Date(req.date).getTime() <=
                new Date(x.date).getTime() + 5400000 &&
              x.doctorId == patient.doctorId,
          )
        ) {
          appointments.push({
            id: Date.now(),
            patientId: patient.id,
            doctorId: patient.doctorId,
          });
          fs.writeFileSync(
            "src/data/appointments.json",
            JSON.stringify(appointments, null, 2),
          );
        } else return res.status(404).json({ message: "bad input" });
      }
      res.status(201).json({ message: "patient added" });
    } else {
      res.status(400).json({ message: "bad input" });
    }
  } catch (error) {}
}

// supprimer un patient
export async function deletePatient(req, res) {
  try {
    const patientId = req.params.id;
    let data = fs.readFileSync("src/data/patients.json", "utf-8");
    let patients = JSON.parse(data);
    let deletedPatient = patients.find((patient) => patient.id == patientId);
    if (deletedPatient) {
      patients = patients.filter((patient) => patient.id !== Number(patientId));
      fs.writeFileSync(
        "src/data/patients.json",
        JSON.stringify(patients, null, 2),
      );
      res.status(200).json({ message: "patient deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log(error);
  }
}

// modifier un patient
export async function updatePatient(req, res) {
  try {
    let data = fs.readFileSync("src/data/patients.json", "utf-8");
    let patients = JSON.parse(data);
    const updateId = req.params.id;
    const toUpdate = req.body;

    const index = patients.findIndex((p) => p.id === Number(updateId));

    if (index !== -1) {
      patients[index] = { ...patients[index], ...toUpdate };
      fs.writeFileSync(
        "src/data/patients.json",
        JSON.stringify(patients, null, 2),
      );
      res.status(201).json({ message: "update sucessfully" });
    } else {
      res.status(400).json({ message: "Not found" });
    }
  } catch (error) {}
}
