import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.config.js";
import apiRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from 'path'
const app = express();
const PORT = process.env.PORT || 4000;
const __dirname = path.resolve()
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.json({ urlencoded: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api", apiRouter);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "/client/dist")))
  app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
  console.log(`server was started on ${PORT} PORT!`);
  connectDB();
});
