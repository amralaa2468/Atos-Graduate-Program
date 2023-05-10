import fs from "fs";
import path from "path";

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import placesRoutes from "./routes/places-routes.js";
import usersPlaces from "./routes/users-routes.js";
import HttpError from "./models/http-error.js";

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersPlaces);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  //handling rollback if user signup process is not completed then we don't want to save the profile image
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.a6jfe76.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000, () => {
      console.log("Connected to db successfully.");
      console.log("Server up and running on port 5000.");
    });
  })
  .catch((err) => {
    console.log(err);
  });

//"mongodb+srv://amralaa:tPpV3Nyfoqgh6hYi@cluster0.23rr58w.mongodb.net/products_test?retryWrites=true&w=majority"
//mongodb+srv://amr:admin@cluster0.a6jfe76.mongodb.net/?retryWrites=true&w=majority
