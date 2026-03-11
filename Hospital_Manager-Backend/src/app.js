import express from "express";
import cors from "cors";
export const app = express();
import routes from "./routes/index.js";
app.use(express.json());
app.use(cors());

// app.use("/", (req, res) => {
//   res.status(200).send("API de gestion hopital");
// });
app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ message: "Path not found" });
});
