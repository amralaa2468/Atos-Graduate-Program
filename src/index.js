import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import questionsRoutes from "./routes/questions-routes.js";
import answersRoutes from "./routes/answers-routes.js";
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

app.use("/api/questions", questionsRoutes);
app.use("/api/answers", answersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@question-bank.fr1egxd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5001, () => {
      console.log("Connected to db successfully.");
      console.log("Server up and running on port 5001.");
    });
  })
  .catch((err) => {
    console.log(err);
  });
