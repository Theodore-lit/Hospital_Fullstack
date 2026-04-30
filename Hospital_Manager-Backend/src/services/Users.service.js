import { User } from "../models/Users.model.js";
import bcrypt from "bcryptjs";

// 📌 Méthode pour comparer le mot de passe (login)
export async function comparePassword(candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
}

// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

export function createUser(payload) {
  return User.create(payload);
}

// export async function createUser({ name, email, password, role }) {
//   try {
//     const user = await User.create({ name, email, password, role });
//     return user;
//   } catch (error) {
//     throw error; // 🚨 PAS next(error)
//   }
// }

export function findOne(email) {
  return User.find({ email: email });
}

export function deleteUser(email) {
  return User.findAndUser({ email: email });
}

export function updateUser(email, payload) {
  return Patient.findAndUpdate(email, payload, {
    returnDocument: "after",
    runValidators: true,
  });
}
