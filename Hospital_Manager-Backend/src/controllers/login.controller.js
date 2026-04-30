// import users from "../data/users.json" with { type: "json" };
import {
  findOne,
  createUser,
  updateUser,
  deleteUser,
  comparePassword,
} from "../services/Users.service.js";
import jwt from "jsonwebtoken";
export const session = {
  curUser: null,
};

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await findOne(email);
  if (!user[0]) return res.status(401).json({ message: "Utilisateur non trouvé" });
console.log(user);

  const isMatch = await comparePassword(password, user[0].password);
  if (!isMatch) return res.satus(401).json({ message: "mot de passe invalid" });

  // tout est bon
  session.curUser = user;
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  // enrégistrer le token dans les cookies
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 3600000,
    sameSite: "lax",
    secure: false,
  });

  // réponse
  return res.json({
    data: { name: user[0].name, role: user[0].role },
    token: token,
  });
}

export async function create(req, res, next) {
  const { name, email, password,role } = req.body;
  // const { name, email, role } = req.doctor;
  // const password = req.password;
  try {
    console.log({ name, email, password, role })
    const user = await createUser({ name, email, password, role });
    res.status(201).json({ message: "✅" });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  const email = req.query.email;
  const updated = req.body;
  try {
    const user = await updateUser(email, updated);
    if (!user) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "✅" });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res) {
  const email = req.body;
  try {
    const user = await deleteUser(email);
    if (!user) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "✅" });
  } catch (error) {
    // next(error);
    console.log(error);
    
  }
}
