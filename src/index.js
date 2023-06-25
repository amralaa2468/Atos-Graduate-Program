import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import notificationsRoutes from "./routes/notificationsRoutes.js";
import HttpError from "./models/http-error.js";
import controllers from "./controllers/controller.js";

const app = express();

//const jsonParser = bodyParser.json();
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

controllers.getAndSaveMessageFromKafka();
app.use("/api/notifications", notificationsRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@notifications.x37jdux.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5004, () => {
      console.log("Connected to db successfully.");
      console.log("Server up and running on port 5004.");
    });
  })
  .catch((err) => {
    console.log(err);
  });
