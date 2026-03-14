import express from "express";
import cors from "cors";
export const app = express();
import routes from "./routes/index.js";
import cookieParser from "cookie-parser"
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
app.use(express.json());
app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(cookieParser());

app.use("/api", routes);

app.use(notFound)
app.use(errorHandler)
