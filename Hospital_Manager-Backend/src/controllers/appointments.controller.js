import PATIENTS from "../data/patients.json" with { type: "json" };
import DOCTORS from "../data/doctors.json" with { type: "json" };
import APPOINTMENTS from "../data/appointments.json" with { type: "json" };
import fs from "fs";
let APPOINTMENTSdoctor = [];

export const allAppointments = (req, res) => {
  const limit = parseInt(req.query.limit ?? 10);
  const page = parseInt(req.query.page ?? 1);
  const byPatientName = req.query.searchpatient;
  const byDoctorName = req.query.doctor;

  let appointmentsAll = APPOINTMENTS.map((apt) => ({
    doctor: DOCTORS.find((doc) => doc.id == apt.doctorId),
    patient: PATIENTS.find((pat) => pat.id == apt.patientId),
    idAppoint: apt.id,
  }));
  if (page < 1 || limit < 1) {
    res.status(400).json({ message: "Page or limit must be >= 1" });
    return;
  }
  const start = (page - 1) * limit;
  let appointments = appointmentsAll.slice(start, start + limit);

  if (byDoctorName || byPatientName) {
    appointments = appointmentsAll.filter((apt) => {
      const firstName = apt.patient.firstName || "";
      const lastName = apt.patient.lastName || "";
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const matchesSearchPatient = fullName.includes(
        byPatientName.toLowerCase(),
      );
      const matchesSearchDoctor =
        byDoctorName === "all" || apt.doctor.name === byDoctorName;
      return matchesSearchPatient && matchesSearchDoctor;
    });
  }
  res.status(200).json({ appointments });
};

export async function addAppointments(req, res) {
  try {
    const rdv = req.body;
    if (
      !APPOINTMENTS.find(
        (x) =>
          new Date(req.date).getTime() <=
            new Date(x.date).getTime() + 5400000 && x.doctorId == req.doctorId,
      )
    ) {
      rdv.id = Date.now();
      const dataPatient = fs.readFileSync("src/data/patients.json", "utf-8");
      const data = fs.readFileSync("src/data/appointments.json", "utf-8");
      let appointments = data.json();
      let patients = dataPatient.json();
      appointments.push(rdv);
      let patient = patients.find((p) => p.id === Number(req.patientId));
      patient.status = "Consultation";
      patient.doctorId = req.doctorId;
      fs.writeFileSync(
        "src/data/appointments.json",
        JSON.stringify(appointments, null, 2),
      );
      fs.writeFileSync(
        "src/data/patients.json",
        JSON.stringify(patients, null, 2),
      );
      res.status(200).json({ message: "appointment saved" });
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
}

export const deleteAppointments = (req, res) => {
  const appointId = req.params.id;
  const data = fs.readFileSync("src/data/appointments.json", "utf-8");
  let appointments = data.json();
  let appoint = appointments.find((apt) => apt.id === Number(appointId));
  if (appoint) {
    appointments = appointments.filter((apt) => apt.id != id);
    fs.writeFileSync(
      "src/data/appointments.json",
      JSON.stringify(appointments, null, 2),
    );
    res.status(200).json({ message: "deleted" });
  } else {
    res.status(400).json({ message: "Bad request" });
  }
};

export const appointmentsByDoctor = (req, res) => {
  const doctorId = req.params.id;
  const limit = parseInt(req.query.limit ?? 10);
  const page = parseInt(req.query.page ?? 1);
  const byPatientName = req.query.searchpatient;
  const filterStatus = req.query.status;
  if (!parseInt(doctorId))
    return res.status(400).json({ message: "Bad request" });
  let appointmentsAll = APPOINTMENTS.filter(
    (apt) => apt.doctorId === Number(doctorId),
  ).map((apt) => ({
    patient: PATIENTS.find((patient) => patient.id === Number(apt.patientId)),
    idAppoint: apt.id,
  }));

  if (page < 1 || limit < 1) {
    res.status(400).json({ message: "Page or limit must be >= 1" });
    return;
  }
  const start = (page - 1) * limit;
  let appointments = appointmentsAll.slice(start, start + limit);

  if (byPatientName) {
    appointments = appointmentsAll.filter((apt) => {
      const firstName = apt.patient.firstName || "";
      const lastName = apt.patient.lastName || "";
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const matchesSearchPatient = fullName.includes(
        byPatientName.toLowerCase(),
      );
      const matchesFilterstatus =
        filterStatus === "all" || apt.patient.status === filterStatus;
      return matchesSearchPatient && matchesFilterstatus;
    });
  }
  APPOINTMENTSdoctor = [...appointments];
  res.status(200).json(appointments);
};

export const appointmentsOfDay = (req, res) => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;
  let appointments = APPOINTMENTSdoctor.filter(
    (apt) => apt.date.split("T")[0] == formattedDate,
  ).map((apt) => ({
    patient: PATIENTS.find((patient) => patient.id === Number(apt.patientId)),
    idAppoint: apt.id,
  }));
  if (appointments.length == 0)
    return res.status(404).json({ message: "Not found" });
  res.status(200).json(appointments);
};
