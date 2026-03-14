import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, "Le nom est obligatoire"], 
      trim: true, 
      minlength: [4, "Le nom doit faire au moins 4 caractères"]
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true, // pas deux utilisateurs avec le même email
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "L'email doit être valide"]
    },
    password: { 
      type: String, 
      required: [true, "Le mot de passe est obligatoire"], 
      minlength: [6, "Le mot de passe doit faire au moins 6 caractères"]
    },
    role: { 
      type: String, 
      required: [true, "Le rôle est obligatoire"], 
      enum: ["admin", "doctor", "receptionnist"], // exemple de rôles possibles
    },
  },
  { timestamps: true, strict: 'throw' },
);

// hasher le mot de passe
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next(); // hash seulement si le mot de passe a changé
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next()
});

// 📌 Méthode pour comparer le mot de passe (login)
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);