import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDb } from "./db/connect.js";
dotenv.config();

const port = process.env.port ?? 3000;
await connectDb();
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
