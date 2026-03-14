import mongoose from "mongoose";

const { Schema } = mongoose;

const receptionnistSchema = new Schema(
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
      default: "Acceuil général",
    },
    phone: {
      type: Number,
      trim: true,
      minlength: [8, "Le numéro doit faire au moins 8 chiffres"],
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
     default: "receptionnist", // exemple de rôles possibles
    },
    image: {
      type: String,
      default: "ReceptionnistImg",
    },
  },
  { timestamps: true, strict: "throw" },
);

export const Receptionnist = mongoose.model("Receptionnist", receptionnistSchema);