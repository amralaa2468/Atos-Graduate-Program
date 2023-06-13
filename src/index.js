import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import examsRoutes from "./routes/exams-routes.js";
import HttpError from "./models/http-error.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});

app.use("/api/exams", examsRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.listen(5002, () => {
  console.log("Server up and running on port 5002.");
});
