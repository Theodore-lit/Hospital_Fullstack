import mongoose from "mongoose";

const { Schema } = mongoose;

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      trim: true,
      minlength: [4, "Le nom doit faire au moins 4 caractères"],
    },
    service: {
      type: String,
      trim: true,
      default: "Praticien",
    },
    phone: {
      type: Number,
      trim: true,
      minlength: [8, "Le numéro doit faire au moins 8 chiffres"],
    },
    speciality: {
      type: String,
      required: [true, "La spécialité est obligatoire"],
      trim: true,
    },
    status: {
      type: String,
      trim: true,
      minlength: [4, "Le staus doit faire au moins 4 caractères"],
      default: "disponible",
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true, // pas deux utilisateurs avec le même email
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "L'email doit être valide"],
    },
    role: {
      type: String,
      required: [true, "Le rôle est obligatoire"],
      default: "doctor", // exemple de rôles possibles
    },
    image: {
      type: String,
      default: "doctorImg",
    },
  },
  { timestamps: true, strict: "throw" },
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
