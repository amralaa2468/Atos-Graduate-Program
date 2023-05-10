import express from "express";
import { check } from "express-validator";

import placesControllers from "../contollers/places-controller.js";
import fileUpload from "../middleware/file-upload.js";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

//ordering the functions(middlewares) is important bec router.use() restricts access to routes below it
router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").notEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [check("title").notEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlaceById
);

router.delete("/:pid", placesControllers.deletePlaceById);

export default router;
